/**
 * ApplicationDetail takes Application.scholarship_responses and Application.user_profile_responses.
 * Which are in the format.
 * {question_key: {question: "", key: "", response: ""}},
 * Modifies in the internal React State as  {question_key: "response"}, but before PATCHING it to the backend,
 * it must convert it back to the expected format: {question_key: {question: "", key: "", response: ""}}
 */
import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import Loading from "../../components/Loading";
import {toastNotify} from "../../models/Utils";
import FormDynamic from "../../components/Form/FormDynamic";
import {Link} from "react-router-dom";
import {Button, Popconfirm} from "antd";
import {formatCurrency, getErrorMessage, handleError, prettifyKeys, scrollToElement} from "../../services/utils";
import Register from "../../components/Register";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import SecurityQuestionAndAnswer from "./SecurityQuestionAndAnswer";
import {
    addQuestionDetailToApplicationResponses,
    transformProfileQuestionsToApplicationForm,
    transformScholarshipQuestionsToApplicationForm
} from "./ApplicationUtils";
import ApplicationEssayAddEdit from "./ApplicationEssayAddEdit";
// import SecurityQuestionAndAnswer from "./SecurityQuestionAndAnswer";

let autoSaveTimeoutId;
class ApplicationDetail extends  React.Component{

    constructor(props) {
        super(props);

        const { location : { pathname } } = this.props;

        this.state = {
            application: {},
            applicationScore: 0,
            scholarship: null,
            isLoadingApplication: false,
            isSavingApplication: false,
            isSubmittingApplication: false,
            scholarshipUserProfileQuestionsFormConfig: null,
            scholarshipQuestionsFormConfig: null,
            viewMode: false,
            isUsingLocalApplication: pathname.includes("/local/"),
            promptRegisterBeforeSubmitting: false,
            userProfileForRegistration: null,
            registrationSuccessMessage: null
        }
    }

    componentDidMount() {
        let viewMode = this.props.location.pathname.includes("view")
        this.setState({viewMode})

        this.getApplication();
    }

    getApplication = () => {
        const { userProfile } = this.props;
        const { isUsingLocalApplication } = this.state;

        if (userProfile) {
            this.getApplicationRemotely();
        } else if (isUsingLocalApplication) {
            this.getApplicationLocally();
        }
    };

    getApplicationRemotely = () => {

        const { match : { params : { applicationID }}, location, userProfile } = this.props;

        this.setState({isLoadingApplication: true});
        ApplicationsAPI.get(applicationID)
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
                if (application.user_scores) {
                    const applicationScore = application.user_scores[userProfile.user] ?
                        application.user_scores[userProfile.user]["score"] : 0;
                    this.setState({applicationScore}, () => {
                        if (location && location.hash) {
                            scrollToElement(location.hash);
                        }
                    });

                }
                this.makeScholarshipQuestionsForm(application, scholarship)
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoadingApplication: false});
            })

    };

    getApplicationLocally = () => {

        const { match : { params : { scholarshipID }} } = this.props;
        this.setState({isLoadingApplication: true});
        ScholarshipsAPI
            .get(scholarshipID)
            .then(res => {
                const {data: scholarship} = res;
                const application = ApplicationsAPI.getOrCreateLocally({id: scholarshipID});
                // TODO load scholarship from remote database
                this.setState({application, scholarship});
                this.makeScholarshipQuestionsForm(application, scholarship);
            })
            .catch((err) => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoadingApplication: false});
            });




    };

    saveApplication = () => {

        const { userProfile } = this.props;

        const { application, scholarship } = this.state;

        const { scholarship_responses, user_profile_responses } = addQuestionDetailToApplicationResponses(application, scholarship);

        if (userProfile) {
            const verification_email = user_profile_responses.email.response
            this.saveApplicationRemotely( {scholarship_responses, user_profile_responses, verification_email}, application.id);
        } else {
            this.saveApplicationLocally({scholarship_responses, user_profile_responses, scholarship }, scholarship);
        }
    };

    saveApplicationRemotely = (applicationData, applicationID) => {


        this.setState({isSavingApplication: true});

        ApplicationsAPI
            .patch(applicationID, applicationData)
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;

                this.afterSaveApplication(application, scholarship);
            })
            .catch(err => {
                console.log({err});
                toastNotify(`An error occurred. Please message us using the chat button in the bottom right.`, 'error');
            })
            .finally(() => {
                this.setState({isSavingApplication: false});
            })
    };

    saveApplicationLocally = (application, scholarship) => {

        application.date_modified = new Date();
        ApplicationsAPI.saveApplicationLocally(application);
        this.afterSaveApplication(application, scholarship);
    };

    /**
     * The format of the application state used for the forms is different from what we send to the database
     * so we must convert the state after each time we send the database to the backend.
     * Don't set state in the application until we have transformed the application otherwise we will get
     * A similar error to this: https://stackoverflow.com/a/57328274/5405197
     * We need to make sure the forms have been converted to their proper html representation and not
     * dictionaries before we render them.
     */

    afterSaveApplication = (application, scholarship) => {
        // this.setState({application, scholarship});
        this.makeScholarshipQuestionsForm(application, scholarship);
    };

    updateApplicationScore = (event) => {
        const { userProfile } = this.props;
        const { application } = this.state;

        const applicationScore = event.target.value;

        const scorerId = userProfile.user;
        this.setState({applicationScore}, () => {

            ApplicationsAPI.scoreApplication(application.id, scorerId, applicationScore)
                .then(res => {
                    console.log({res})
                })
                .catch(err=>{
                    console.log({err});
                    toastNotify(handleError(err))
                })
        })
    };

    submitApplication = () => {
        const { userProfile } = this.props;
        if (userProfile) {
            this.submitApplicationRemotely();
        } else {
            this.setState({promptRegisterBeforeSubmitting: true})
        }
    };

    createApplicationAfterRegistration = (userProfile) => {
        const { application, scholarship } = this.state;
        const { scholarship_responses, user_profile_responses } = addQuestionDetailToApplicationResponses(application, scholarship);

        this.setState({isLoadingApplication: true});
        ApplicationsAPI
            .getOrCreate({scholarship_responses, user_profile_responses, scholarship: scholarship.id, user: userProfile.user})
            .then(res=>{
                // State needs to be updated with new application from response ideally
                // const application = res.data
                // this.setState({application})
                // TEMPORARY SOLUTION
                const { data: { application } } = res;
                const successMessage = (
                    <h5 className="text-center text-muted">
                        <span role="img" aria-label="happy face emoji">🙂 </span>
                        Successfully saved your application! <br/>
                        {/*TODO temporarily open in new tab until we can get the props to update when applicationID or scholarship ID in url changes*/}
                        <Link to={`/application/${application.id}`} target="_blank">View your Application</Link>{' '}
                        before submitting
                    </h5>);

                toastNotify(successMessage, 'info', {position: 'bottom-right'});

                this.setState({registrationSuccessMessage: successMessage, promptRegisterBeforeSubmitting: false});
            })
            .catch(err => {
                console.log({err});
                toastNotify(`🙁 An error occurred`, 'error');
            })
            .finally(() => {
                this.setState({isLoadingApplication: false});
            })
    };

    submitApplicationRemotely = () => {
        this.setState({isSubmittingApplication: true});
        // TODO when this function is called, if user is not logged in. Show the Registration component
        //  and return

        const { application, scholarship } = this.state;
        const { scholarship_responses, user_profile_responses } = addQuestionDetailToApplicationResponses(application, scholarship);

        ApplicationsAPI
            .submit(application.id, {scholarship_responses, user_profile_responses})
            .then(res=>{
                // State needs to be updated with new application from response ideally
                // const application = res.data
                // this.setState({application})
                // TEMPORARY SOLUTION
                this.setState({viewMode: true})
                const successMessage = (
                    <p>
                    <span role="img" aria-label="happy face emoji">🙂 </span>
                    Successfully submitted your application!
                    </p>);

                toastNotify(successMessage, 'info', {position: 'bottom-right'});
            })
            .catch(err => {
                console.log({err});
                toastNotify(`🙁 An error occurred ${getErrorMessage(err)}`, 'error');
            })
            .finally(() => {
                this.setState({isSubmittingApplication: false});
            })
    };

    /**
     * Update the Application object to have it's dictionary contain the form values needed for the forms on this page.
     * @param scholarship
     * @param application
     */
    makeScholarshipQuestionsForm = (application, scholarship) => {

        const { specific_questions, user_profile_questions } = scholarship;

        const scholarshipQuestionsFormConfig = transformScholarshipQuestionsToApplicationForm(specific_questions);
        const scholarshipUserProfileQuestionsFormConfig = transformProfileQuestionsToApplicationForm(user_profile_questions);

        const {
            scholarship_responses,
            user_profile_responses,
        } = application;

        let scholarshipResponses = {};
        let userProfileResponses = {};

        Object.keys(scholarship_responses).forEach(responseKey => {
            scholarshipResponses[responseKey] = scholarship_responses[responseKey] ? scholarship_responses[responseKey].response : "";
        });
        Object.keys(user_profile_responses).forEach(responseKey => {
            userProfileResponses[responseKey] = user_profile_responses[responseKey] ? user_profile_responses[responseKey].response : "";
        });

        const updatedApplication = {
            ...application,
            scholarship_responses: scholarshipResponses,
            user_profile_responses: userProfileResponses,
        };

        this.setState({scholarshipQuestionsFormConfig, scholarshipUserProfileQuestionsFormConfig, application: updatedApplication});

    };

    updateForm = (event, applicationResponseType) => {
        if (event.stopPropagation) {
            event.stopPropagation(); // https://github.com/facebook/react/issues/3446#issuecomment-82751540
        }

        let { application } = this.state;
        const name = event.target.name;
        let value = event.target.value;

        if (event.target.type==='checkbox'){
            value = event.target.checked
        }
        application[applicationResponseType][name] = value;

        this.setState(prevState => ({
            application: {
                ...prevState.application,
                [applicationResponseType]: {
                    ...prevState.application[applicationResponseType],
                    [name]: value
                }

            }
        }), () => {

            if (autoSaveTimeoutId) {
                clearTimeout(autoSaveTimeoutId);
            }
            autoSaveTimeoutId = setTimeout(() => {
                // Runs 1 second (1000 ms) after the last change
                this.saveApplication();
            }, 1000);
        })

    };

    /**
     * questions is a list in one of two formats:
     * [{key: "", question: ""}]
     * [{key: ""}]
     *
     * scholarship_responses:
     * favourite-sport: "<p>volleyball</p>"
     * why-do-you-deserve-this-scholarship: "<p>I like food</p>"

     * user_profile_responses:
     * email: "hadinawar+8@hotmail.com"
     * first_name: "Hadi"
     * last_name: "hakeem8
     */
    viewForm = (questions, responseDict) => {

        return questions.map((question) => (
            <div key={question.key}>
                <div className="white-space-pre-wrap">
                    <b>{question.question||prettifyKeys(question.key)}:</b><br/>

                    {question.type === "long_answer" ?
                        <div className="my-1" dangerouslySetInnerHTML={{__html: responseDict[question.key]}} />
                        : question.type === "checkbox" ? responseDict[question.key] ? "Yes" : "No" : responseDict[question.key]}
                </div>
            </div>
        ));
    };

    renderHeader = () => {
        const { application, scholarship } = this.state;
        if (application.accepted_payment) {
            return (
                <h3 className={"text-success"}>
                    You have already accepted your payment for this scholarship!
                </h3>
            )
        }

        if (application.is_winner && scholarship) {
            return (
                <div>
                    <h3 className="text-success">
                        Congratulations! You received the award of{' '}
                        {formatCurrency(Number.parseInt(scholarship.funding_amount))}
                    </h3>
                    <Button onClick={()=> {}} type="primary">
                        <Link to={`/payment/accept/?application=${application.id}`}>
                            Accept Payment
                        </Link>
                    </Button>
                </div>
            )
        }

        let dateSubmitted;
        if (application.is_submitted) {

            dateSubmitted = new Date(application.date_submitted);
            return (
                <>
                <h5 className="text-muted">
                    Your application was submitted on
                    {' '}
                    {dateSubmitted.toDateString()}{' '}
                    {dateSubmitted.toLocaleTimeString()}
                    {' '}
                    Good luck! <br/>
                </h5>
                <div>
                    <strong>
                        <ol>
                            <li>Important: Make sure you received your submission confirmation in your email.</li>
                            <li>If it's in your spam, mark it as not spam.</li>
                            <li>If you don't complete those steps, you might also miss the email to accept your award payment if you win.</li>
                            <li>If you if you don't accept your award before the acceptance deadline, it might be given to someone else.</li>
                        </ol>
                    </strong>
                    Contact us using the chat in the bottom right if you need help.
                </div>

                </>
            )
        }
    };

    render() {
        const { match : { params : { applicationID }}, userProfile } = this.props;
        const { application, isLoadingApplication, scholarship, isSavingApplication, isSubmittingApplication,
            scholarshipUserProfileQuestionsFormConfig, scholarshipQuestionsFormConfig,
            viewMode, isUsingLocalApplication, promptRegisterBeforeSubmitting, registrationSuccessMessage,
            applicationScore } = this.state;

        let dateModified;
        if (application.date_modified) {
            dateModified = new Date(application.date_modified);
            dateModified =  (<p className="text-muted float-left">
                Last Auto-Saved {isUsingLocalApplication? " locally ": null}: {dateModified.toDateString()}{' '}
                {dateModified.toLocaleTimeString()}
            </p>)
        } else {
            dateModified =  (<p className="text-muted float-left">
                Start typing and your application will automatically save
            </p>)
        }
        let seoContent = {
            ...defaultSeoContent,
            title: `Scholarship Application${scholarship? ` for ${scholarship.name}`:""}`
        };

        if (isLoadingApplication) {
            return (
                <div className="container mt-5">
                    <HelmetSeo content={seoContent}/>
                    <div className="card shadow p-3">
                        <Loading  title="Loading Application..."/>
                    </div>
                </div>
            );
        }

        if (!isLoadingApplication && !scholarship) {
            return (
                <div className="container mt-5">
                    <HelmetSeo content={seoContent}/>
                    <div className="card shadow p-3">
                        <h1>Application not found</h1>
                        <h5 className="center-block text-muted">
                            Try <Link to={`/login?redirect=application/${applicationID}`}>
                            logging in</Link> to view this page if your application is here.
                        </h5>

                    </div>
                </div>
            )
        }

        let applicationScoreContent = null;

        if (application.user && userProfile && application.user.user !== userProfile.user) {
            applicationScoreContent = (<div>
                <input className="form-control col-12"
                       type="number" step={0.01} min={0} max={10}
                       onChange={this.updateApplicationScore}
                       value={applicationScore}/>
                <p>Your score is automatically usaved</p>
            </div>);
        }


        const { deadline} = scholarship;

        let scholarshipDateMoment = moment(deadline);
        const isScholarshipDeadlinePassed = scholarshipDateMoment.diff(moment(), 'days') < 0;
        let scholarshipDateString = scholarshipDateMoment.format('dddd, MMMM DD, YYYY');

        let submitContent = (
            <Popconfirm placement="topRight" title={"Once you submit your application, you won't be able to edit it." +
            " Are you sure you want to submit?"}
                        onConfirm={this.submitApplication}
                        okText="Yes" cancelText="No">
                <Button type={"primary"}
                        className={"float-right"}>
                    Submit...
                </Button>
            </Popconfirm>
        );

        if (isScholarshipDeadlinePassed) {
            submitContent = (<p className="text-muted float-right">
                Scholarship deadline has passed. Scholarship was due on {scholarshipDateString}
            </p>)
        }



        return (
            <>
                <HelmetSeo content={seoContent}/>
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        {scholarship &&
                        <h1>
                            Application for <Link to={`/scholarship/${scholarship.slug}`}>
                            {scholarship.name}
                        </Link>
                        </h1>
                        }
                        {this.renderHeader()}
                        <div>
                            {scholarshipUserProfileQuestionsFormConfig && scholarshipQuestionsFormConfig &&
                            <div>
                                {!viewMode && !application.is_submitted &&
                                <>
                                    <h2>Profile Questions</h2>
                                    <FormDynamic onUpdateForm={event => this.updateForm(event, 'user_profile_responses')}
                                                 model={application.user_profile_responses}
                                                 inputConfigs=
                                                     {scholarshipUserProfileQuestionsFormConfig}
                                    />

                                    <h2>Scholarship Questions</h2>
                                    <FormDynamic onUpdateForm={event => this.updateForm(event, 'scholarship_responses')}
                                                 model={application.scholarship_responses}
                                                 inputConfigs=
                                                     {scholarshipQuestionsFormConfig}
                                    />
                                    {dateModified}
                                    {!registrationSuccessMessage && !promptRegisterBeforeSubmitting &&
                                        submitContent
                                    }
                                </>
                                }
                                {application.is_submitted &&
                                    <div id="publish" className="row col-12 my-3">
                                        <h2>Publish your Application as an Essay</h2>
                                        <ApplicationEssayAddEdit application={application} />
                                    </div>
                                }
                                {application && userProfile && application.user &&
                                    application.user.user === userProfile.user  &&
                                    <div id="security">
                                        <SecurityQuestionAndAnswer />
                                    </div>
                                }
                                {promptRegisterBeforeSubmitting &&
                                <>
                                    <h3>Create a username and password to access your application later
                                    and review your application once more before submitting</h3>
                                    {/*
                                        One subtle thing to notice here is that user_profile_responses can either be in the format of:
                                        {key: value, key: value} or in the format of {key:{key: "", response: "", type: "", question:""}}
                                        So this code operates under the assumption that application.user_profile_responses is using the first format of simple key:value,
                                        This assumption holds because this form renders when promptRegisterBeforeSubmitting is True so application.user_profile_responses has
                                        not been transformed into the nested dictionary at this point.
                                    */}
                                    <Register location={this.props.location}
                                              userProfile={application.user_profile_responses}
                                              disableRedirect={true}
                                              onRegistrationFinished={this.createApplicationAfterRegistration} />
                                </>
                                }
                                {registrationSuccessMessage}

                                {(viewMode || application.is_submitted || application.is_payment_accepted) &&
                                <>

                                    {applicationScoreContent}
                                    <h2>Profile Questions</h2>
                                    {this.viewForm(scholarship.user_profile_questions, application.user_profile_responses)}
                                    <br />
                                    <h2>Scholarship Questions</h2>
                                    {this.viewForm(scholarship.specific_questions, application.scholarship_responses)}
                                </>
                                }
                            </div>
                            }

                        </div>
                        {isLoadingApplication && <Loading  title="Loading Application..."/>}
                        {isSavingApplication && <Loading  title="Saving Application..."/>}
                        {isSubmittingApplication && <Loading  title="Submitting Application..."/>}
                    </div>
                </div>
            </>
        );
    }
}


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ApplicationDetail);
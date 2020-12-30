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
import {Button, Popconfirm, Steps} from "antd";
import { getErrorMessage, handleError, prettifyKeys, scrollToElement } from "../../services/utils";
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
import FileInput from "../../components/Form/FileInput";
import {DEFAULT_USER_PROFILE_PICTURE_URL} from "../../models/UserProfile";
import UserProfileAPI from "../../services/UserProfileAPI";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import ApplicationDetailHeader from "./ApplicationDetailHeader";

const { Step } = Steps;

let applicationPages = [
    {
        title: 'Questions',
    },
    {
        title: 'Verification',
    },
    {
        title: 'Review',
    }
];

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
            isUsingLocalApplication: pathname.includes("/local/"),
            promptRegisterBeforeSubmitting: false,
            userProfileForRegistration: null,
            pageNumber: 1
        }
    }

    componentDidMount() {
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
                const { application } = res.data

                this.props.history.push(`/application/${application.id}`)
                window.location.reload()
                /* Instead of setting all the state variables manually to work for a real application,
                   it's cleaner to just refresh, and all of that will be taken care of automatically.
                   This is better for maintanability as well because when adding new state variables, they don't
                   need to be considered to be updated here.*/
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
        const { application, scholarship } = this.state;
        const { userProfile } = this.props;
        const { scholarship_responses, user_profile_responses } = addQuestionDetailToApplicationResponses(application, scholarship);

        if (userProfile.profile_pic_url === DEFAULT_USER_PROFILE_PICTURE_URL){
            const failMessage = "A profile picture must be set in the Verification Step.";
            toastNotify(failMessage, 'error')
            return;
        }

        if (!userProfile.security_question_is_answered){
            const failMessage = "A security question and answer must be set in the Verification Step.";
            toastNotify(failMessage, 'error')
            return;
        }

        this.setState({isSubmittingApplication: true});
        ApplicationsAPI
            .submit(application.id, {scholarship_responses, user_profile_responses})
            .then(res=>{

                // TODO figure out how to call setState({application}) after submission without causing the following error:
                //  Uncaught Error: Objects are not valid as a React child (found: object with keys {key, response}).
                //  If you meant to render a collection of children, use an array instead.

                // State needs to be updated with new application from response ideally
                // const application = res.data
                // this.setState({application})
                // TEMPORARY SOLUTION

                const submittedApplication = {
                    ...application,
                    is_submitted: true,
                };
                this.setState({ application: submittedApplication });

                window.scrollTo(0, 0);
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

        console.log({ name, value });

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
    viewForm = (questions, responseDict, isOwnerofApplication) => {
        let { application } = this.state;

        return questions.map((question) => {
            if ((question.key === "first_name" || question.key === "last_name") && !isOwnerofApplication) {
                return (<div key={question.key}>
                    <div className="white-space-pre-wrap">
                        <b>{prettifyKeys(question.key)}:</b><br/>
                        {application[question.key]}
                    </div>
                </div>);
            }
            if (question.key === "email" && !isOwnerofApplication) {
                return null;
            }
            return (<div key={question.key}>
                <div className="white-space-pre-wrap">
                    <b>{question.question || prettifyKeys(question.key)}:</b><br/>

                    {question.type === "long_answer" ?
                        <div className="my-1" dangerouslySetInnerHTML={{__html: responseDict[question.key]}}/>
                        : question.type === "checkbox" ?
                            responseDict[question.key] ? "Yes" : "No"
                            : responseDict[question.key]}
                </div>
            </div>)});
    };

    changePage = (pageNumber) => {
        this.setState({pageNumber});
    };

    onChangeProfilePicture = (event) => {
        const { userProfile, updateLoggedInUserProfile } = this.props;

        UserProfileAPI.patch(
            {
                profile_pic_url: event.target.value,
            }, userProfile.user)
            .then(res => {
                updateLoggedInUserProfile(res.data);
            })
            .catch(err=> {
                console.log({err});
            });
    };

    render() {
        const { match : { params : { applicationID }}, userProfile } = this.props;
        const { application, isLoadingApplication, scholarship, isSavingApplication, isSubmittingApplication,
            scholarshipUserProfileQuestionsFormConfig, scholarshipQuestionsFormConfig,
            isUsingLocalApplication, promptRegisterBeforeSubmitting,
            applicationScore, pageNumber } = this.state;

        const applicationSteps =
            (<Steps current={pageNumber-1} onChange={(current) => this.changePage(current+1)}>
            { applicationPages.map(item => {
                return (<Step key={item.title} title={item.title} />)
            })}
        </Steps>)

        let inViewMode = application.is_submitted;
        let dateModified;
        if (application.date_modified) {
            dateModified = new Date(application.date_modified);
            dateModified =  (<div className="text-muted float-left col-12">
                Last Auto-Saved {isUsingLocalApplication? " locally ": null}: {dateModified.toDateString()}{' '}
                {dateModified.toLocaleTimeString()}
            </div>)
        } else {
            dateModified =  (<div className="text-muted float-left col-12">
                Start typing and your application will automatically save
            </div>)
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

        let isMissingProfilePicture = false;
        let isMissingSecurityQuestionAnswer = false;
        let isOwnerOfApplication = userProfile && application.user && (application.user.user === userProfile.user);

        if (userProfile) {
            isMissingProfilePicture = !userProfile.profile_pic_url ||
                userProfile.profile_pic_url === DEFAULT_USER_PROFILE_PICTURE_URL;
            isMissingSecurityQuestionAnswer = !userProfile.security_question_is_answered;
        }

        let applicationScoreContent = null;

        if (application.user && !isOwnerOfApplication) {
            applicationScoreContent = (<div>
                <p>You can score applications on Atila's website or use your own system to review applications. <br />
                <b>These scores are only used to help you keep track of applications.</b></p>
                <input className="form-control col-12"
                       type="number" step={0.01} min={0} max={10}
                       onChange={this.updateApplicationScore}
                       value={applicationScore}/>
                <p>Your score is automatically saved</p>
            </div>);
        }

        const { deadline } = scholarship;

        let scholarshipDateMoment = moment(deadline);
        const isScholarshipDeadlinePassed = scholarshipDateMoment.diff(moment(), 'days') < 0;
        let scholarshipDateString = scholarshipDateMoment.format('dddd, MMMM DD, YYYY');
        let disableSubmit = isMissingProfilePicture||isMissingSecurityQuestionAnswer;
        let submitContent = (
            <Popconfirm placement="topRight" title={"Once you submit your application, you won't be able to edit it." +
            " Are you sure you want to submit?"}
                        disabled={disableSubmit}
                        onConfirm={this.submitApplication}
                        okText="Yes" cancelText="No">
                <Button type={"primary"}
                        disabled={disableSubmit}
                        className={"float-right col-md-6"}>
                    Submit...
                </Button>
            </Popconfirm>
        );

        let applicationForm = (<>
            <h2>Profile Questions</h2>
            {dateModified}
            <FormDynamic onUpdateForm={event => this.updateForm(event, 'user_profile_responses')}
                         model={application.user_profile_responses}
                         inputConfigs=
                             {scholarshipUserProfileQuestionsFormConfig}
            />

            <h2>Scholarship Questions</h2>
            {dateModified}
            <FormDynamic onUpdateForm={event => this.updateForm(event, 'scholarship_responses')}
                         model={application.scholarship_responses}
                         inputConfigs=
                             {scholarshipQuestionsFormConfig}
            />
            </>);

        if (isScholarshipDeadlinePassed) {
            submitContent = (<p className="text-muted float-right">
                Scholarship deadline has passed. Scholarship was due on {scholarshipDateString}
            </p>)
        }

        let viewModeContent = (<>
                {applicationScoreContent}
                <h2>Profile Questions</h2>
                {this.viewForm(scholarship.user_profile_questions, application.user_profile_responses, isOwnerOfApplication)}
                <br />
                <h2>Scholarship Questions</h2>
                {this.viewForm(scholarship.specific_questions, application.scholarship_responses, isOwnerOfApplication)}
        </>);

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
                        <ApplicationDetailHeader application={application} scholarship={scholarship} userProfile={userProfile}/>
                        <div>
                            {scholarshipUserProfileQuestionsFormConfig && scholarshipQuestionsFormConfig &&
                            <div>
                                {!inViewMode && userProfile &&
                                <>
                                    {applicationSteps}
                                    <br />
                                    {(pageNumber === 1) &&
                                    <>
                                        {applicationForm}
                                    </>
                                    }
                                    {(pageNumber === 2) &&
                                        <>
                                            <h2>Upload Profile Picture</h2>

                                            <h6 className="text-muted">
                                                As part of account verification and to
                                                ensure a community of real students
                                                you must upload a picture of yourself.
                                            </h6>

                                            {!isMissingProfilePicture &&
                                                <>
                                                <p className="text-muted">Picture upload step complete</p>
                                                    <img
                                                    alt="user profile"
                                                    style={{ height: '250px', width: 'auto' }}
                                                    className="rounded-circle cursor-pointer"
                                                    src={userProfile.profile_pic_url}
                                                    />
                                                </>
                                            }
                                            {isMissingProfilePicture &&
                                            <FileInput title={"Profile Picture"}
                                                       type={"image"}
                                                       keyName={"profile_pic_url"}
                                                       filePath={`user-profile-pictures/${userProfile.user}`}
                                                       onChangeHandler={this.onChangeProfilePicture} />

                                            }
                                            <div id="security">
                                                <SecurityQuestionAndAnswer />
                                            </div>
                                        </>
                                    }
                                    {(pageNumber === applicationPages.length) &&
                                        <>
                                        {viewModeContent}
                                        </>
                                    }
                                    <br />
                                    <br />

                                    <div>
                                        {pageNumber > 1 &&
                                        <Button className="float-left col-md-6"
                                                onClick={() => this.changePage(pageNumber-1)}>Back</Button>}

                                        {pageNumber < applicationPages.length &&
                                        <Button className="float-right col-md-6"
                                                onClick={() => this.changePage(pageNumber+1)}>
                                            Next
                                        </Button>}

                                        {pageNumber === applicationPages.length &&
                                        <>
                                            {submitContent}
                                        </>
                                        }
                                        {pageNumber > 1 && (isMissingProfilePicture || isMissingSecurityQuestionAnswer) &&
                                        <div className="text-muted float-right">

                                            {isMissingSecurityQuestionAnswer &&
                                            <p>
                                                Add a security question and answer before you can submit.
                                            </p>
                                            }
                                            {isMissingProfilePicture &&
                                            <p>
                                                Add a picture of yourself before you can submit.
                                            </p>
                                            }
                                        </div>

                                        }

                                    </div>
                                </>
                                }
                                {!inViewMode && !userProfile &&
                                    <>
                                        {applicationForm}
                                        {!promptRegisterBeforeSubmitting &&
                                        submitContent
                                        }
                                    </>
                                }
                                {promptRegisterBeforeSubmitting &&
                                <>
                                    <br />
                                    <br />
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
                                {inViewMode && viewModeContent}
                                {inViewMode && isOwnerOfApplication &&
                                    <>
                                        <hr/>
                                        <div id="publish" className="row col-12 my-3">
                                            <h2>Publish your Application as an Essay</h2>
                                            <ApplicationEssayAddEdit application={application} />
                                        </div>
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

const mapDispatchToProps = {
    updateLoggedInUserProfile
};
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDetail);
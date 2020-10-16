/**
 * ApplicationDetail takes Application.scholarship_responses and Application.user_profile_responses.
 * Which are in the format.
 * {question_key: {question: "", key: "", response: ""}},
 * Modifies in the internal React State as  {question_key: "response"}, but before PATCHING it to the backend,
 * it must convert it back to the expected format: {question_key: {question: "", key: "", response: ""}}
 */
import React from "react";
import {connect} from "react-redux";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import Loading from "../../components/Loading";
import {SCHOLARSHIP_QUESTIONS_TYPES_TO_FORM_TYPES} from "../../models/Scholarship";
import {userProfileFormConfig} from "../../models/UserProfile";
import {scholarshipUserProfileSharedFormConfigs, toastNotify} from "../../models/Utils";
import FormDynamic from "../../components/Form/FormDynamic";
import {Link} from "react-router-dom";
import {Button, Popconfirm} from "antd";
import {formatCurrency, extractContent, getErrorMessage} from "../../services/utils";
import Register from "../../components/Register";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";

class ApplicationDetail extends  React.Component{

    constructor(props) {
        super(props);

        const { location : { pathname } } = this.props;

        this.state = {
            application: {},
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

        const { match : { params : { applicationID }} } = this.props;

        this.setState({isLoadingApplication: true});
        ApplicationsAPI.get(applicationID)
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
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

        const application = ApplicationsAPI.getOrCreateLocally({id: scholarshipID});

        // TODO load scholarship from remote database
        const { scholarship } = application;
        this.setState({application, scholarship});
        this.makeScholarshipQuestionsForm(application, scholarship);

    };

    saveApplication = () => {

        const { userProfile } = this.props;

        const { application, scholarship } = this.state;

        const {scholarship_responses, user_profile_responses } = addQuestionDetailToApplicationResponses(application, scholarship);

        if (userProfile) {
            this.saveApplicationRemotely( {scholarship_responses, user_profile_responses }, application.id);
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
                toastNotify(`🙁 An error occured, check your connection!`, 'error');
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

        const successMessage = (
            <p>
                <span role="img" aria-label="happy face emoji">🙂 </span>
                Successfully saved your application!
            </p>);

        toastNotify(successMessage, 'info', {position: 'bottom-right'});
    }

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

        console.log({userProfile, scholarship_responses, user_profile_responses});
        this.setState({isLoadingApplication: true});
        ApplicationsAPI
            .post({scholarship_responses, user_profile_responses, scholarship_id: scholarship.id, user_id: userProfile.user})
            .then(res=>{
                // State needs to be updated with new application from response ideally
                // const application = res.data
                // this.setState({application})
                // TEMPORARY SOLUTION
                console.log({res});
                const { data: application } = res;
                this.setState({viewMode: true});
                const successMessage = (
                    <p>
                        <span role="img" aria-label="happy face emoji">🙂 </span>
                        Successfully saved your application! <br/>
                        You can
                        <Link to={`/application/${application.id}`}>View Application</Link> before submitting
                    </p>);

                toastNotify(successMessage, 'info', {position: 'bottom-right'});
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
                toastNotify(`🙁 An error occurred`, 'error');
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
            event.stopPropagation();
        }

        let { application } = this.state;
        const name = event.target.name;
        const value = event.target.value;
        application[applicationResponseType][name] = value;

        this.setState(prevState => ({
            application: {
                ...prevState.application,
                [applicationResponseType]: {
                    ...prevState.application[applicationResponseType],
                    [name]: value
                }

            }
        }))

    };

    viewForm = (responseDict) => {
        /*
        scholarship_responses:
        favourite-sport: "<p>volleyball</p>"
        why-do-you-deserve-this-scholarship: "<p>I like food</p>"

        user_profile_responses:
        email: "hadinawar+8@hotmail.com"
        first_name: "Hadi"
        last_name: "hakeem8
         */

        let responseList = []
        for (var key in responseDict) {
            responseList.push(<ResponseTransformer title={key} data={responseDict[key]}/>)
        }

        return responseList
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
                    <Button onClick={this.saveApplication} type="primary">
                        <Link to={`/payment/accept/?application=${application.id}`}>
                            Accept Payment
                        </Link>
                    </Button>
                </div>
            )
        }

        if (application.is_submitted) {
            return (
                <h3 className="text-success">
                    Your application has been submitted. Good luck!
                </h3>
            )
        }
    };

    render() {
        const { match : { params : { applicationID }} } = this.props;
        const { application, isLoadingApplication, scholarship, isSavingApplication, isSubmittingApplication,
            scholarshipUserProfileQuestionsFormConfig, scholarshipQuestionsFormConfig,
            viewMode, isUsingLocalApplication, promptRegisterBeforeSubmitting } = this.state;


        let dateModified;
        if (application.date_modified) {
            dateModified = new Date(application.date_modified);
            dateModified =  (<p className="text-muted center-block">
                Last saved {isUsingLocalApplication? " locally ": null}: {dateModified.toDateString()}{' '}
                {dateModified.toLocaleTimeString()}
            </p>)
        }
        let seoContent = {
            ...defaultSeoContent,
            title: `Scholarship Application${scholarship? ` for ${scholarship.name}`:""}`
        };

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


        return (
            <>
                <HelmetSeo content={seoContent}/>
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        {scholarship &&
                        <h1>
                            Application for (<Link to={`/scholarship/${scholarship.slug}`}>
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
                                    <Button onClick={this.saveApplication} type="primary">
                                        Save
                                    </Button>
                                    {dateModified}
                                    <Popconfirm placement="topRight" title={"Once you submit your application, you won't be able to edit it. Are you sure you want to submit?"}
                                                onConfirm={this.submitApplication}
                                                okText="Yes" cancelText="No">
                                        <Button type={"primary"} className={"float-right"}>
                                            Submit
                                        </Button>
                                    </Popconfirm>
                                </>
                                }
                                {promptRegisterBeforeSubmitting &&
                                <>
                                    <h3>Create a username and password to access your application later</h3>
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

                                {(viewMode || application.is_submitted || application.is_payment_accepted) &&
                                <>
                                    <h2>Profile Questions</h2>
                                    {this.viewForm(application.user_profile_responses)}
                                    <br />
                                    <h2>Scholarship Questions</h2>
                                    {this.viewForm(application.scholarship_responses)}
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

/**
 * Transform array of questions of the form:
 * {
  "key": "why-do-you-deserve-this-scholarship",
  "question": "Why do you deserve this scholarship?",
  "type": "long_answer"
} into format:

 {
        keyName: "why-do-you-deserve-this-scholarship",
        placeholder: "Why do you deserve this scholarship?",
        label: "Why do you deserve this scholarship?"
        type: 'html_editor'
    }
 * @param questions
 */
export function transformScholarshipQuestionsToApplicationForm(questions) {

    return questions.map(question => (
        {
            keyName: question.key,
            placeholder: question.question,
            label: question.question,
            type: SCHOLARSHIP_QUESTIONS_TYPES_TO_FORM_TYPES[question.type],
        }
    ));
}

/***
 * Takes an array of questions in the following format and return all the elements that match the UserProfile questions.
 * @param scholarshipProfileQuestions
 * @returns {*}
 */
export function transformProfileQuestionsToApplicationForm(scholarshipProfileQuestions) {

    const formQuestions = [];
    const allProfileQuestions = [...userProfileFormConfig, ...scholarshipUserProfileSharedFormConfigs];

    scholarshipProfileQuestions.forEach(scholarshipProfileQuestion => {
        const positionInAllProfileQuestions =  allProfileQuestions.findIndex((item) => scholarshipProfileQuestion.key === item.keyName)

        if (positionInAllProfileQuestions > -1) {
            formQuestions.push(allProfileQuestions[positionInAllProfileQuestions]);
        }

    });

    return formQuestions
}

/**
 * For an application that has application.scholarship_responses
 * in the form {"why-do-you-deserve-this-scholarship": "I am awesome."},
 * for each response, add info about the question:
 * {
  "key": "why-do-you-deserve-this-scholarship",
  "question": "Why do you deserve this scholarship?",
  "type": "long_answer"
  "response": "I am awesome."
}
 * @param application
 * @param scholarship
 * @returns {*}
 */
function addQuestionDetailToApplicationResponses(application, scholarship) {


    const scholarshipResponses = {};
    const userProfileResponses = {};
    Object.keys(application.scholarship_responses).forEach( responseKey => {
        const question = scholarship.specific_questions.find(question => {
            return question.key === responseKey
        });
        if (question) {
            scholarshipResponses[responseKey] = {
                ...question,
                "response": application.scholarship_responses[responseKey]
            }
        }
    });

    Object.keys(application.user_profile_responses).forEach( responseKey => {
        const question = scholarship.user_profile_questions.find(question => {
            return question.key === responseKey
        });
                if (question) {
            userProfileResponses[responseKey] = {
                ...question,
                response: application.user_profile_responses[responseKey]
            }
        }
    });

    return {
        scholarship_responses: scholarshipResponses,
        user_profile_responses: userProfileResponses,
    };

}

function ResponseTransformer(props) {
    return (
        <div>
            <p><b>{props.title}:</b> {extractContent(props.data)}</p>
        </div>
    )
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ApplicationDetail);
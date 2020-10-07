import React from "react";
import {connect} from "react-redux";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import Loading from "../../components/Loading";
import {SCHOLARSHIP_QUESTIONS_TYPES_TO_FORM_TYPES} from "../../models/Scholarship";
import {userProfileFormConfig} from "../../models/UserProfile";
import {scholarshipUserProfileSharedFormConfigs} from "../../models/Utils";
import FormDynamic from "../../components/Form/FormDynamic";
import {Link} from "react-router-dom";
import {Button} from "antd";
import {formatCurrency} from "../../services/utils";

class ApplicationDetail extends  React.Component{

    constructor(props) {
        super(props);

        this.state = {
            application: {},
            scholarship: null,
            isLoadingApplication: false,
            isSavingApplication: false,
            scholarshipUserProfileQuestionsFormConfig: null,
            scholarshipQuestionsFormConfig: null,
        }
    }

    componentDidMount() {
        this.getApplication();
    }

    getApplication = () => {
        const { match : { params : { applicationID }} } = this.props;

        this.setState({isLoadingApplication: true});
        ApplicationsAPI.get(applicationID)
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
                this.makeScholarshipQuestionsForm(scholarship)
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoadingApplication: false});
            })
    };

    saveApplication = () => {

        const { application } = this.state;

        const {scholarship_responses, user_profile_responses, id } = application;
        this.setState({isSavingApplication: true});

        ApplicationsAPI
            .patch(id, {scholarship_responses, user_profile_responses})
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
                this.makeScholarshipQuestionsForm(scholarship)
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isSavingApplication: false});
            })
    };


    makeScholarshipQuestionsForm = (scholarship) => {

        const { specific_questions, user_profile_questions } = scholarship;

        const scholarshipQuestionsFormConfig = transformScholarshipQuestionsToApplicationForm(specific_questions);
        const scholarshipUserProfileQuestionsFormConfig = transformProfileQuestionsToApplicationForm(user_profile_questions);

        this.setState({scholarshipQuestionsFormConfig, scholarshipUserProfileQuestionsFormConfig});
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
                ...prevState.application,           // copy all other key-value pairs of food object
                [applicationResponseType]: {                     // specific object of food object
                    ...prevState.application[applicationResponseType],   // copy all pizza key-value pairs
                    [name]: value // update value of specific key
                }

            }
        }))

    };

    render() {

        const { match : { params : { applicationID }} } = this.props;
        const { application, isLoadingApplication, scholarship, isSavingApplication,
            scholarshipUserProfileQuestionsFormConfig, scholarshipQuestionsFormConfig } = this.state;

        const userProfileResponses = {};
        if (application.user_profile_responses) {
            application.user_profile_responses.forEach(response => {
                userProfileResponses[response.key] = response.value;
            });
        }


        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>
                        Application for {scholarship ? (<Link to={`/scholarship/${scholarship.slug}`}>
                            {scholarship.name}
                        </Link>)
                            : applicationID}
                    </h1>
                    {application && scholarship &&
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
                    </div>}
                    <div>
                        {scholarshipUserProfileQuestionsFormConfig && scholarshipQuestionsFormConfig &&
                        <div>
                            <h2>Profile Questions</h2>
                            <FormDynamic onUpdateForm={event => this.updateForm(event, 'user_profile_responses')}
                                         model={userProfileResponses}
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
                        </div>



                        }
                    </div>
                    {isLoadingApplication && <Loading  title="Loading Application..."/>}
                    {isSavingApplication && <Loading  title="Saving Application..."/>}
                </div>
            </div>
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
function transformScholarshipQuestionsToApplicationForm(questions) {

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
function transformProfileQuestionsToApplicationForm(scholarshipProfileQuestions) {

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

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ApplicationDetail);
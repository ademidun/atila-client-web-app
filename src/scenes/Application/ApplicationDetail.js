import React from "react";
import {connect} from "react-redux";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import Loading from "../../components/Loading";
import {SCHOLARSHIP_QUESTIONS_TYPES_TO_FORM_TYPES} from "../../models/Scholarship";
import {userProfileFormConfig} from "../../models/UserProfile";
import {scholarshipUserProfileSharedFormConfigs} from "../../models/Utils";
import FormDynamic from "../../components/Form/FormDynamic";
import {Link} from "react-router-dom";

class ApplicationDetail extends  React.Component{

    constructor(props) {
        super(props);

        this.state = {
            application: {},
            scholarship: null,
            isLoadingApplication: false,
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

    makeScholarshipQuestionsForm = (scholarship) => {

        const { specific_questions, user_profile_questions } = scholarship;

        const scholarshipQuestionsFormConfig = transformScholarshipQuestionsToApplicationForm(specific_questions);
        const scholarshipUserProfileQuestionsFormConfig = transformProfileQuestionsToApplicationForm(user_profile_questions);

        this.setState({scholarshipQuestionsFormConfig, scholarshipUserProfileQuestionsFormConfig});
    };

    updateForm = (event) => {

    };

    render() {

        const { match : { params : { applicationID }}, userProfile } = this.props;
        const { application, isLoadingApplication, scholarship,
            scholarshipUserProfileQuestionsFormConfig, scholarshipQuestionsFormConfig } = this.state;

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>
                        Application for {scholarship ? (<Link to={`/scholarship/${scholarship.slug}`}>
                            {scholarship.name}
                        </Link>)
                            : applicationID}
                    </h1>
                    <div>
                        {scholarshipUserProfileQuestionsFormConfig && scholarshipQuestionsFormConfig &&
                        <div>
                            <h2>Profile Questions</h2>
                            <FormDynamic onUpdateForm={this.updateForm}
                                         model={userProfile}
                                         inputConfigs=
                                             {scholarshipUserProfileQuestionsFormConfig}
                            />
                            <h2>Scholarship Questions</h2>
                            <FormDynamic onUpdateForm={this.updateForm}
                                         model={application.scholarship_responses}
                                         inputConfigs=
                                             {scholarshipQuestionsFormConfig}
                            />
                        </div>

                        }
                    </div>
                    {isLoadingApplication && <Loading  title="Loading Application..."/>}
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
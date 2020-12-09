import {SCHOLARSHIP_QUESTIONS_TYPES_TO_FORM_TYPES} from "../../models/Scholarship";
import {userProfileFormConfig} from "../../models/UserProfile";
import {scholarshipUserProfileSharedFormConfigs} from "../../models/Utils";

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
        const positionInAllProfileQuestions = allProfileQuestions.findIndex((item) => scholarshipProfileQuestion.key === item.keyName)

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
export function addQuestionDetailToApplicationResponses(application, scholarship) {


    const scholarshipResponses = {};
    const userProfileResponses = {};
    Object.keys(application.scholarship_responses).forEach(responseKey => {
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

    Object.keys(application.user_profile_responses).forEach(responseKey => {
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
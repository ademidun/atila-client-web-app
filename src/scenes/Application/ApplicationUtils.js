import {SCHOLARSHIP_QUESTIONS_TYPES_TO_FORM_TYPES} from "../../models/Scholarship";
import {userProfileFormConfig} from "../../models/UserProfile";
import {scholarshipUserProfileSharedFormConfigs} from "../../models/Utils";
import { prettifyKeys, stripHtml } from '../../services/utils';
import React from 'react';
import TextUtils from '../../services/utils/TextUtils';

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
            ...(question.hasOwnProperty('options')) && {options: question.options},
            html: (application) => (
                <React.Fragment>
                    {["medium_answer", "long_answer"].includes(question.type)? <p>Word Count: {TextUtils.countWords(application[question.key])}</p> : "" }
                </React.Fragment>
            )
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

/**
 * Convert a list of application objects with nested attributes
 * and return as a list of flat dictionaries that can be exported as a csv.
 * @param {Array} applications
 * @returns {Array(Object)} applicationsCSV
 */
export function convertApplicationsToCSVFormat(applications) {

    const allApplicationsCSV = [];

    applications.forEach(application => {
        /**
         * Create the applicationCSV object in this order:
         * 1. Add user profile attributes
         * 2. Add user profile detail
         * 3. Add application details
         * 4. Add scholarship response details
         */

        let applicationCSV = {
            application_id: application.id,
        };
        if (application.is_submitted) {
            if (application.user) {
                const { user: { user: user_id, first_name, last_name } } = application;

                applicationCSV = {
                    ...applicationCSV,
                    user_id, first_name, last_name
                };

                for (const questionResponse of Object.values(application.user_profile_responses)) {
                    applicationCSV[questionResponse.key] = questionResponse.response;
                }
            } else {//if scholarship.is_blind_application is True, user attribute is not available
                const { first_name_code, last_name_code } = application;

                applicationCSV = {
                    ...applicationCSV,
                    first_name_code, last_name_code,
                };
            }
            

        }
        const { is_submitted, date_submitted, average_user_score } = application;



        applicationCSV = {
            ...applicationCSV,
            is_submitted, date_submitted, average_user_score
        };

        if (application.is_submitted) {
            for (const questionResponse of Object.values(application.scholarship_responses)) {
                applicationCSV[questionResponse.question] = questionResponse.type === "long_answer" ? stripHtml(questionResponse.response) : questionResponse.response;
            }
        }

        allApplicationsCSV.push(applicationCSV);

    });

    return allApplicationsCSV;
}

export const maxApplicationScoreDifference = userScores => {
    // Takes in application.user_scores as input and returns the max score difference

    if (!userScores || Object.keys(userScores).length === 0) {
        return 0;
    }

    let userScoresList = Object.keys(userScores).map(key => {
        let scoresInfo = userScores[key];
        return Number(scoresInfo['score']);
    });

    if (userScoresList.length === 0) {
        return  0;
    }

    let minNum = userScoresList[0];
    let maxNum = userScoresList[0];

    for (let i = 0; i < userScoresList.length; i++) {
        minNum = Math.min(minNum, userScoresList[i]);
        maxNum = Math.max(maxNum, userScoresList[i]);
    }

    return maxNum - minNum ? (maxNum - minNum).toFixed(2) : maxNum - minNum;
}

/**
 * Given a list of applications, return all the applications that match the searchTerm.
 * @param {Array} applications 
 * @param {String} searchTerm 
 */
export const searchApplications = (applications, searchTerm) => {

    const matchingApplications = [];

    applications.forEach(application => { 

        if (!application.scholarship_responses) {
            return;
        }

        const matches = findOccurencesOfSearchTerm(application, searchTerm);

        if (matches.length > 0) {
            matchingApplications.push(application);
            return;

        }
        
    })

    return matchingApplications;
}

/**
 * Given an application and a searchTerm, return all the matches of that word with context.
 * If contextSize is given Include N characters before the match and N characters after the match.
 * @param {Object} application 
 * @param {String} searchTerm 
 */

export const findOccurencesOfSearchTerm = ( application, searchTerm, contextSize=50 ) => {
    
    const occurencesOfSearchTerm = [];

    const questionResponses = Object.values(application.scholarship_responses);
    for (const userProfileResponseKey in application.user_profile_responses) {
        if (Object.hasOwnProperty.call(application.user_profile_responses, userProfileResponseKey)) {
            let userProfileResponseValue = application.user_profile_responses[userProfileResponseKey].response;
            if (!userProfileResponseValue) {
                continue
            }
            if (typeof userProfileResponseValue === "string" || userProfileResponseValue instanceof String) {
                questionResponses.unshift({response: `${prettifyKeys(userProfileResponseKey)}: ${userProfileResponseValue}`})
            } else if (userProfileResponseValue.prop && userProfileResponseValue.prop.constructor === Array) {
                userProfileResponseValue = userProfileResponseValue.join(', ');
                questionResponses.unshift({response: `${prettifyKeys(userProfileResponseKey)}: ${userProfileResponseValue}`})
            }
        }
    }

    for (const questionResponse of questionResponses) {
        const responseText = questionResponse.type === "long_answer" ? stripHtml(questionResponse.response) : questionResponse.response;

        let searchTermRegex = new RegExp(searchTerm, 'gi');
        let matches;


        while ((matches = searchTermRegex.exec(responseText)) !== null) {
            
            let context;
            let contextHtml;
            if (contextSize === 0) {
                context = contextHtml = matches[0]
            } else {
                /**
                 * Get the surrounding snippet that matches a search term.
                 */

                const fullTextStart = 0;
                const fulTextEnd = responseText.length - 1;

                let contextStart = matches.index - contextSize;
                contextStart = Math.max( matches.index - contextSize, fullTextStart);

                let contextEnd = Math.min(matches.index +  searchTerm.length + contextSize, fulTextEnd);
                context = matches.input.substring(contextStart, contextEnd);
                contextHtml = (
                    <>
                    {contextStart > fullTextStart ? "..." : ""} {matches.input.substring(contextStart, matches.index)}
                    <span  style={{backgroundColor: "yellow"}}>
                        {matches.input.substring(matches.index, matches.index + searchTerm.length)}
                    </span>
                    {matches.input.substring(matches.index + searchTerm.length, contextEnd)} {contextEnd < fulTextEnd ? "..." : ""}
                    </>
                )

                // If context does not start at the beginning of the full text, prefix with an elipsis.
                // Add an elipsis suffix if context ends before the end of the full text.
                if (contextStart > fullTextStart) {
                    context = `...${context}`
                } if (contextEnd < fulTextEnd) {
                    context = `${context}...`
                }
                

            }

            occurencesOfSearchTerm.push({
                "key": questionResponse.key,
                "value": context,
                "html": contextHtml,
            })
        }


    }

    return occurencesOfSearchTerm;

}

import { stripHtml } from './utils';
/**
 * Convert a list of application objects with nested attributes
 * and return as a list of flat dictionaries that can be exported as a csv.
 * @param {Array} applications 
 * @returns {Array(Object)} applicationsCSV
 */
export function convertApplicationsToCSVFormat(applications) {

    console.log({applications});
    const allApplicationsCSV = []

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
            const { user: { user: user_id, first_name, last_name } } = application;
            
            applicationCSV = {
                ...applicationCSV,
                user_id, first_name, last_name
            };

            for (const questionResponse of Object.values(application.user_profile_responses)) {
                applicationCSV[questionResponse.key] = questionResponse.response
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

    } )

    console.log({allApplicationsCSV});
    return allApplicationsCSV;
}
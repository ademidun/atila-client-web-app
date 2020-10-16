import request from 'axios';
import Environment from './Environment'

class ApplicationsAPI {

    static applicationsApiUrl = `${Environment.apiUrl}/application/applications`;

    static getOrCreate = (scholarship, user) => {
        /***
         * Takes a scholarship ID and user ID as input. Returns a dict in the form:
         * {
         *     "application": {},
         *     "created": boolean,
         * }
         * @type {AxiosPromise}
         */

        const apiCompletionPromise = request({
            method: 'post',
            data: {scholarship, user},
            url: `${ApplicationsAPI.applicationsApiUrl}/get-or-create/`,
        });

        return apiCompletionPromise;
    };

    static getOrCreateLocally = (scholarship) => {
        /**
         * Takes a scholarship ID and checks local storage to see if an application for this ID already exists.
         * Intended to be used for applications from non-logged in users.
         * @type {string}
         */

        const localApplicationID = `local_application_scholarship_id_${scholarship.id}`;
        let applicationData = localStorage.getItem(localApplicationID);
        if (!applicationData) {

            const { deadline, funding_amount, id, name, slug, specific_questions, user_profile_questions } = scholarship;
            applicationData = {
                user_profile_responses: {},
                scholarship_responses: {},
                scholarship: { deadline, funding_amount, id, name, slug, specific_questions, user_profile_questions }
            };

            applicationData = JSON.stringify(applicationData);

            localStorage.setItem(localApplicationID, applicationData);
        }

        applicationData = JSON.parse(applicationData);

        return applicationData;
    };

    static get = (applicationID) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ApplicationsAPI.applicationsApiUrl}/${applicationID}/`,
        });

        return apiCompletionPromise;
    };

    static doesApplicationExist = (userID, scholarshipID) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ApplicationsAPI.applicationsApiUrl}/does-application-exist/?user_profile=${userID}&scholarship=${scholarshipID}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (id, data) => {

        const apiCompletionPromise = request({
            method: 'patch',
            data,
            url: `${this.applicationsApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static saveApplicationLocally = (application) => {


        const { scholarship } = application;

        const localApplicationID = `local_application_scholarship_id_${scholarship.id}`;

        const applicationData = JSON.stringify(application);

        localStorage.setItem(localApplicationID, applicationData);

        return applicationData;
    }
}

export default ApplicationsAPI;
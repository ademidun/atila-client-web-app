import request from 'axios';
import Environment from './Environment'

class ApplicationsAPI {

    static applicationsApiUrl = `${Environment.apiUrl}/application/applications`;

    static getOrCreate = (data) => {
        /***
         * Takes a scholarship ID, user ID and other application details as input. Returns a dict in the form:
         * {
         *     "application": {},
         *     "created": boolean,
         * }
         * @type {AxiosPromise}
         */

        const apiCompletionPromise = request({
            method: 'post',
            data,
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
        applicationData.scholarship = scholarship;

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

    static submit = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${this.applicationsApiUrl}/${id}/submit/`
        });

        return apiCompletionPromise
    };

    static saveApplicationLocally = (application) => {


        const { scholarship } = application;

        const localApplicationID = `local_application_scholarship_id_${scholarship.id}`;

        const applicationData = JSON.stringify(application);

        localStorage.setItem(localApplicationID, applicationData);

        return applicationData;
    }

    static resendVerificationEmail = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${this.applicationsApiUrl}/${id}/resend-verification-email/`
        });

        return apiCompletionPromise
    };

    static verifyEmailCode = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${this.applicationsApiUrl}/${id}/verify-email-code/`
        });

        return apiCompletionPromise
    };

    static scoreApplication = (applicationId, scorerUserId, score) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {user_id: scorerUserId, score},
            url: `${this.applicationsApiUrl}/${applicationId}/score-application/`
        });

        return apiCompletionPromise
    };

    static acceptPayment = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${this.applicationsApiUrl}/${id}/accept-payment/`
        });

        return apiCompletionPromise
    };

    static sendThankYouLetter = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${this.applicationsApiUrl}/${id}/send-thank-you-letter/`
        });

        return apiCompletionPromise
    };
}

export default ApplicationsAPI;
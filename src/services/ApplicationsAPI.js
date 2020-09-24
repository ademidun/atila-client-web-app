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
}

export default ApplicationsAPI;
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

    static get = (applicationID) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ApplicationsAPI.applicationsApiUrl}/${applicationID}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (data, id) => {

        const apiCompletionPromise = request({
            method: 'patch',
            data,
            url: `${this.applicationsApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };
}

export default ApplicationsAPI;
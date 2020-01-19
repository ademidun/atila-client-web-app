import request from 'axios';
import Environment from './Environment'
class ApplicationsApi {

    static applicationsApiUrl = `${Environment.apiUrl}/application/applications`;

    static getOrCreate = (scholarship) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.applicationsApiUrl}/get-or-create/?scholarship=${scholarship}`,
        });

        return apiCompletionPromise;
    };

    static get = (appId) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.applicationsApiUrl}/${appId}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (appId, data) => {

        const apiCompletionPromise = request({
            method: 'patch',
            url: `${this.applicationsApiUrl}/${appId}/`,
            data
        });

        return apiCompletionPromise;
    };
}

export default ApplicationsApi;
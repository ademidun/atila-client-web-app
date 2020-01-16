import request from 'axios';
import Environment from './Environment'
class ApplicationsApi {

    static applicationsApiUrl = `${Environment.apiUrl}/application/applications`;

    static getOrCreate = (user, scholarship) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.applicationsApiUrl}/get-or-create/?user=${user}&scholarship=${scholarship}`,
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
}

export default ApplicationsApi;
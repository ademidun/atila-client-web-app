import request from 'axios';
import Environment from './Environment'
class ScheduleAPI {

    static apiUrl = `${Environment.apiUrl}/mentorship`;
    static calendlyApiUrl = `https://api.calendly.com`;

    static getCalendlyAccessToken = (authCode: string) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {code: authCode},
            url: `${ScheduleAPI.apiUrl}/get-calendly-access-token/`
        });

        return apiCompletionPromise;
    };

    static getEventTypes = (userId: string, accessToken: string) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScheduleAPI.calendlyApiUrl}/event_types?user=${userId}`,
            headers:{
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return apiCompletionPromise;
    };
}

export default ScheduleAPI;
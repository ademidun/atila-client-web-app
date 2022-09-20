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

    static getUser = (userId: string) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScheduleAPI.calendlyApiUrl}/users/${userId}`,
            headers:{
                'Authorization': `Bearer: ${localStorage.getItem('calendarAccessToken')||''}`
            }
        });

        return apiCompletionPromise;
    };

    static getEventTypes = (userId: string) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScheduleAPI.calendlyApiUrl}/event_types/users/${userId}`,
            headers:{
                'Authorization': `Bearer: ${localStorage.getItem('calendarAccessToken')||''}`
            }
        });

        return apiCompletionPromise;
    };
}

export default ScheduleAPI;
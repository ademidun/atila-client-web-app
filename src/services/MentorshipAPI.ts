import request from 'axios';
import Environment from './Environment'
class MentorshipAPI {

    static mentorshipAPIUrl = `${Environment.apiUrl}/mentorship`;
    static create = (user: number) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {user},
            url: `${MentorshipAPI.mentorshipAPIUrl}/mentors/`,
        });

        return apiCompletionPromise;
    };
}

export default MentorshipAPI;
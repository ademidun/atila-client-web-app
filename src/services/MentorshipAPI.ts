import request from 'axios';
import { Mentor } from '../models/Mentor';
import Environment from './Environment'
class MentorshipAPI {

    static mentorshipAPIUrl = `${Environment.apiUrl}/mentorship`;
    static createMentor = (user: number) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {user},
            url: `${MentorshipAPI.mentorshipAPIUrl}/mentors/`,
        });

        return apiCompletionPromise;
    };

    static patchMentor = ({mentor}: ({mentor: Partial<Mentor>})) => {
        
        // user and id shouldn't be passed in the patch request
        const { id, user, ...data } = mentor;
        const apiCompletionPromise = request({
            method: 'patch',
            data,
            url: `${MentorshipAPI.mentorshipAPIUrl}/mentors/${id}/`,
        });

        return apiCompletionPromise;
    };

    static listMentors = () => {
        const apiCompletionPromise = request({
            method: 'get',
            url: `${MentorshipAPI.mentorshipAPIUrl}/mentors/`,
        });

        return apiCompletionPromise;
    };
}

export default MentorshipAPI;
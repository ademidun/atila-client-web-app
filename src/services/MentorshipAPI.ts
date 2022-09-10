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

    static patchMentor = ({data, id}: ({data: Partial<Mentor>, id: string})) => {
        
        // user and id shouldn't be passed in the patch request
        delete data.id; 
        delete data.user;
        const apiCompletionPromise = request({
            method: 'patch',
            data,
            url: `${MentorshipAPI.mentorshipAPIUrl}/mentors/${id}/`,
        });

        return apiCompletionPromise;
    };
}

export default MentorshipAPI;
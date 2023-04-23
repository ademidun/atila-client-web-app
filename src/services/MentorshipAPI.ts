import request from 'axios';
import { Mentor } from '../models/Mentor';
import { MentorshipSession } from '../models/MentorshipSession';
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

    static sessionScheduled = (id: string, event_details: any) => {
        
        const apiCompletionPromise = request({
            method: 'post',
            data: {event_details},
            url: `${MentorshipAPI.mentorshipAPIUrl}/sessions/${id}/scheduled/`,
        });

        return apiCompletionPromise;
    };

    static listMentors = (path='') => {
        const apiCompletionPromise = request({
            method: 'get',
            url: `${MentorshipAPI.mentorshipAPIUrl}/mentors/${path}`,
        });

        return apiCompletionPromise;
    };



    static patchSession = (session: Partial<MentorshipSession>) => {
        
        const apiCompletionPromise = request({
            method: 'patch',
            data: session,
            url: `${MentorshipAPI.mentorshipAPIUrl}/sessions/${session.id}/`,
        });

        return apiCompletionPromise;
    };

    static getSession = (sessionId: string) => {
        const apiCompletionPromise = request({
            method: 'get',
            url: `${MentorshipAPI.mentorshipAPIUrl}/sessions/${sessionId}/`,
        });

        return apiCompletionPromise;
    };
}

export default MentorshipAPI;
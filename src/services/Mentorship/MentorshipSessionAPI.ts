import request from 'axios';
import Environment from './../Environment'
class MentorshipSesssionAPI {

    static mentorshipSesssionAPIUrl = `${Environment.apiUrl}/mentorship/sessions`;
    static createMentorshipSession = ({mentor, mentee}: ({mentor: string, mentee: number})) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {mentor, mentee},
            url: `${MentorshipSesssionAPI.mentorshipSesssionAPIUrl}/`,
        });

        return apiCompletionPromise;
    };
}

export default MentorshipSesssionAPI;
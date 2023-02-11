import request from 'axios';
import Environment from './../Environment'
class MentorshipSesssionAPI {

    static mentorshipSesssionAPIUrl = `${Environment.apiUrl}/mentorship/sessions`;
    static mentorshipCodeAPIUrl = `${Environment.apiUrl}/mentorship/codes`;
    static createMentorshipSession = ({mentor, mentee, discountcode_set}:
         ({mentor: string, mentee: number, discountcode_set?:Array<string>})) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {mentor, mentee, discountcode_set},
            url: `${MentorshipSesssionAPI.mentorshipSesssionAPIUrl}/`,
        });

        return apiCompletionPromise;
    };

    static verifyDiscountCode = ({code}: ({code: string})) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {code},
            url: `${MentorshipSesssionAPI.mentorshipCodeAPIUrl}/verify/`,
        });

        return apiCompletionPromise;
    };
}

export default MentorshipSesssionAPI;
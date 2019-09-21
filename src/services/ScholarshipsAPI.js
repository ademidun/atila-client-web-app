import request from 'axios';
import Environment from './Environment'
class ScholarshipsAPI {

    static scholarshipsApiUrl = `${Environment.apiUrl}/scholarships`;
    static searchScholarships = (searchPayload, page=1) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: searchPayload,
            url: `${Environment.apiUrl}/scholarship-preview/?page=${page}`,
        });

        return apiCompletionPromise;
    };

    static getSlug = (slug) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/scholarship-slug/?slug=${slug}`,
        });

        return apiCompletionPromise;
    }

    static put = (id, scholarship) => {

        const apiCompletionPromise = request({
            method: 'put',
            data: scholarship,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static create = (scholarship) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: scholarship,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/`,
        });

        return apiCompletionPromise;
    };

    static cleanScholarship = (scholarship) => {
        if(!scholarship.funding_amount) {
            scholarship.funding_amount = 0;
        }

        if(scholarship.deadline) {
            // to fix the following error
            // The specified value "2019-09-21T23:59:00Z" does not conform to the required format.
            // The format is "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS"
            scholarship.deadline = scholarship.deadline.substring(0,16);
        }
        return scholarship;
    }
}

export default ScholarshipsAPI;
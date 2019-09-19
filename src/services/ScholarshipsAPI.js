import request from 'axios';
import Environment from './Environment'
class ScholarshipsAPI {

    static scholarshipUrl = `${Environment.apiUrl}/scholarships`;
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
            url: `${ScholarshipsAPI.scholarshipUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static create = (scholarship) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: scholarship,
            url: `${ScholarshipsAPI.scholarshipUrl}/`,
        });

        return apiCompletionPromise;
    };

    static cleanScholarshipBeforeCreate = (scholarship) => {
        if(!scholarship.funding_amount) {
            scholarship.funding_amount = 0;
        }
        return scholarship;
    }
}

export default ScholarshipsAPI;
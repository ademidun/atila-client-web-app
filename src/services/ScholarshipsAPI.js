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
    };

    static getDueSoon = () => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/due-soon/`,
        });

        return apiCompletionPromise;
    };

    static get = (id = '') => {
        /**
         * Get Scholarship using the scholarship's ID
         * @type {AxiosPromise}
         */

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static list = (queryString = '') => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${queryString}/`,
        });

        return apiCompletionPromise;
    };

    static relatedItems = (id) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrlRecommender}/related/${id}`,
        });

        return apiCompletionPromise;
    };

    static put = (id, scholarship, locationData) => {

        const apiCompletionPromise = request({
            method: 'put',
            data: {scholarship: ScholarshipsAPI.cleanScholarship(scholarship), locationData},
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (id, data) => {

        const apiCompletionPromise = request({
            method: 'patch',
            data,
            url: `${this.scholarshipsApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static create = (scholarship, locationData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {scholarship: ScholarshipsAPI.cleanScholarship(scholarship), locationData},
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/`,
        });

        return apiCompletionPromise;
    };

    static cleanScholarship = (scholarship) => {

        const newScholarship = Object.assign({}, scholarship);
        if(!newScholarship.funding_amount) {
            newScholarship.funding_amount = 0;
        }

        if(newScholarship.deadline) {
            // to fix the following error
            // The specified value "2019-09-21T23:59:00Z" does not conform to the required format.
            // The format is "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS"
            newScholarship.deadline = newScholarship.deadline.substring(0,16);
        }

        delete newScholarship.location;

        newScholarship.female_only = !!newScholarship.female_only;
        newScholarship.international_students_eligible = !!newScholarship.international_students_eligible;
        newScholarship.is_not_available = !!newScholarship.is_not_available;

        return newScholarship;
    };

    static getApplications = (id) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/applications/`,
        });

        return apiCompletionPromise;
    };

    static getFinalists = (id) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/finalists/`,
        });

        return apiCompletionPromise;
    };

    static selectWinners = (id, winners) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: winners,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/select-winner/`,
        });

        return apiCompletionPromise;
    };

    static publishScholarship = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/publish-scholarship/`,
        });

        return apiCompletionPromise;
    };

    static emailApplicants = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/email-applicants/`,
        });

        return apiCompletionPromise;
    };
}

export default ScholarshipsAPI;
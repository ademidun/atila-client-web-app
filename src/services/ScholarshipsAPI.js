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
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/related/`,
        });

        return apiCompletionPromise;
    };

    static put = (id, scholarship, locationData, awards) => {

        const apiCompletionPromise = request({
            method: 'put',
            data: {
                scholarship: ScholarshipsAPI.cleanScholarship(scholarship),
                locationData,
                awards
            },
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

    static create = (scholarship, locationData, awards) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {scholarship: ScholarshipsAPI.cleanScholarship(scholarship), locationData, awards},
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/`,
        });

        return apiCompletionPromise;
    };

    static cleanScholarship = (scholarship) => {

        const newScholarship = Object.assign({}, scholarship);
        if(!newScholarship.funding_amount) {
            newScholarship.funding_amount = 0;
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

    static getPendingInvites = id => {
        return this.getInvites(id, 'pending');
    };

    static getInvites = (id, status=null) => {
        let url = `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/invites/`
        if (status) {
            url += `?status=${status}`
        }
        const apiCompletionPromise = request({
            method: 'get',
            url: url,
        });

        return apiCompletionPromise;
    };

    static notifyApplicantsFinalistsSelected = (id) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {},
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/notify-applicants-finalists-selected/`,
        });

        return apiCompletionPromise;
    };

    static selectWinners = (id, winnerID, awardID) => {
        const data = {
            winner: winnerID, 
            award: awardID,
        }

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/select-winner/`,
        });

        return apiCompletionPromise;
    };

    static saveScholarshipContribution = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/save-scholarship-contribution/`,
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

    static unSubmitApplications = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/unsubmit-applications/`,
        });

        return apiCompletionPromise;
    };

    static inviteCollaborator = (id, username) => {
        let data = {'username': username};

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/invite-collaborator/`,
        });

        return apiCompletionPromise;
    };

    static inviteCollaboratorViaEmail = (id, email, source) => {
        let data = {'email': email, 'source': source};

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/invite-collaborator/`,
        });

        return apiCompletionPromise;
    };

    static assignReviewers = (id, reviewersPerApplication, selectedReviewers) => {
        let data = { 
            "reviewers_per_application": reviewersPerApplication,
            "reviewers": selectedReviewers,
        }

        const apiCompletionPromise = request({
            method: "post",
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/assign-reviewers/`,
        });

        return apiCompletionPromise;
    };

    static reportIncorrectInfo = (id, data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${ScholarshipsAPI.scholarshipsApiUrl}/${id}/report-incorrect-info/`,
        });

        return apiCompletionPromise;
    };
}

export default ScholarshipsAPI;
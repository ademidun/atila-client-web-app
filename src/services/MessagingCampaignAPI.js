import request from 'axios';
import Environment from './Environment'
class MessagingCampaignAPI {

    static messagingCampaignApiUrl = `${Environment.apiUrl}/messaging/messaging-campaigns`;

    static get = (id = '') => {
        /**
         * Get MessagingCampaign using the campaign's ID
         * @type {AxiosPromise}
         */

        const apiCompletionPromise = request({
            method: 'get',
            url: `${MessagingCampaignAPI.messagingCampaignApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (id, campaign) => {

        const apiCompletionPromise = request({
            method: 'patch',
            data: campaign,
            url: `${MessagingCampaignAPI.messagingCampaignApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static create = (campaign) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: campaign,
            url: `${MessagingCampaignAPI.messagingCampaignApiUrl}/`,
        });

        return apiCompletionPromise;
    };
}

export default MessagingCampaignAPI;
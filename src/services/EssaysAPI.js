import request from 'axios';
import Environment from './Environment'
class EssaysApi {

    static list = (page=1) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/essay/essays/?page=${page}`,
        });

        return apiCompletionPromise;
    };

    static getSlug = (slug) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/essay/essay/${slug}/`,
        });

        return apiCompletionPromise;
    }
}

export default EssaysApi;
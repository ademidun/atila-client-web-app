import request from 'axios';
import Environment from './Environment'
class EssaysApi {

    static essaysApiUrl = `${Environment.apiUrl}/essay/essays`;
    static list = (page=1) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${EssaysApi.essaysApiUrl}/?page=${page}`,
        });

        return apiCompletionPromise;
    };

    static getSlug = (slug) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/essay/essay/${slug}/`,
        });

        return apiCompletionPromise;
    };

    static create = (essay) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: essay,
            url: `${EssaysApi.essaysApiUrl}/`,
        });

        return apiCompletionPromise;
    };

    static update = (id, essay) => {

        const apiCompletionPromise = request({
            method: 'put',
            data: essay,
            url: `${EssaysApi.essaysApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (id, essay) => {
        return EssaysApi.update(id, essay, "patch")
    };
}

export default EssaysApi;
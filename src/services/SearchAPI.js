import request from 'axios';
import Environment from './Environment'
class SearchApi {

    static searchUrl = Environment.apiUrl + '/search';
    static relatedItems = (queryString) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${SearchApi.searchUrl}/related-items/${queryString}`,
        });

        return apiCompletionPromise;
    };

    static getSlug = (slug) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/blog/blog/${slug}/`,
        });

        return apiCompletionPromise;
    }

    static search = (searchQuery) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${SearchApi.searchUrl}/?q=${searchQuery}`,
        });

        return apiCompletionPromise;
    };
}

export default SearchApi;
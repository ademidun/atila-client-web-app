import request from 'axios';
import Environment from './Environment'
class CollectionsAPI {

    static collectionsAPIUrl = `${Environment.apiUrl}/atlas/collection`;
    static get = (id: string) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${CollectionsAPI.collectionsAPIUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };
}

export default CollectionsAPI;
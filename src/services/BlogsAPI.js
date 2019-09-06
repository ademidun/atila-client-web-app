import request from 'axios';
import Environment from './Environment'
class BlogsApi {

    static list = (page=1) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/blog/blog-posts/?page=${page}`,
        });

        return apiCompletionPromise;
    };

    static getSlug = (username, slug) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/blog/blog-slug/${username}/${slug}`,
        });

        return apiCompletionPromise;
    }
}

export default BlogsApi;
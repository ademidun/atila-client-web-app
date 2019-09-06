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

    static getSlug = (slug) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/blog/blog/${slug}/`,
        });

        return apiCompletionPromise;
    }
}

export default BlogsApi;
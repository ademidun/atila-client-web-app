import request from 'axios';
import Environment from './Environment'
class BlogsApi {

    static blogsApiUrl = `${Environment.apiUrl}/blog/blog-posts`;

    static list = (page=1) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${BlogsApi.blogsApiUrl}/?page=${page}`,
        });

        return apiCompletionPromise;
    };

    static getSlug = (slug) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${Environment.apiUrl}/blog/blog/${slug}/`,
        });

        return apiCompletionPromise;
    };

    static create = (blog) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: blog,
            url: `${BlogsApi.blogsApiUrl}/`,
        });

        return apiCompletionPromise;
    };

    static update = (id, blog) => {

        const apiCompletionPromise = request({
            method: 'put',
            data: blog,
            url: `${BlogsApi.blogsApiUrl}/${id}/`,
        });

        return apiCompletionPromise;
    };
}

export default BlogsApi;
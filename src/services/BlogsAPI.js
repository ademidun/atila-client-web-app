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

    static update = (id, data, method="put") => {
        console.log({data});
        const apiCompletionPromise = request({
            url: `${BlogsApi.blogsApiUrl}/${id}/`,
            method,
            data,
        });

        return apiCompletionPromise;
    };

    static patch = (id, data) => {
        return BlogsApi.update(id, data, "patch")
    };

    static relatedItems = (id) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${BlogsApi.blogsApiUrl}/${id}/related/`,
        });

        return apiCompletionPromise;
    };

    static inviteContributor = (id, username) => {
        let data = {'username': username};

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${BlogsApi.blogsApiUrl}/${id}/invite-contributor/`,
        });

        return apiCompletionPromise;
    };

    static removeContributor = (id, username) => {
        let data = {'username': username};

        const apiCompletionPromise = request({
            method: 'post',
            data: data,
            url: `${BlogsApi.blogsApiUrl}/${id}/remove-contributor/`,
        });

        return apiCompletionPromise;
    };
}

export default BlogsApi;
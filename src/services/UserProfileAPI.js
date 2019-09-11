import request from 'axios';
import axios from 'axios';
import Environment from './Environment'
class UserProfileAPI {

    static userProfileEndPoint = `${Environment.apiUrl}/user-profiles`;
    static userEndPoint = `${Environment.apiUrl}/users`;

    static getUsername = (username) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/user-name/?username=${username}/`,
        });

        return apiCompletionPromise;
    }

    static getUserContent = (userId, contentType) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/${userId}/${contentType}/`,
        });

        return apiCompletionPromise;
    }

    static login = (loginCredentials) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: loginCredentials,
            url: `${Environment.apiUrl}/login/`,
        });

        return apiCompletionPromise;
    };

    static createUser = (registrationData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: registrationData,
            url: `${this.userEndPoint}/`,
        });

        return apiCompletionPromise;
    };

    static authenticateRequests = () => {

        const jwtToken = localStorage.getItem('token');
        if (jwtToken) {
            axios.defaults.headers.common['Authorization'] = `JWT ${jwtToken}`;
        }
    }
}

export default UserProfileAPI;
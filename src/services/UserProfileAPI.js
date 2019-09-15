import request from 'axios';
import axios from 'axios';
import Environment from './Environment'
import jwtDecode from 'jwt-decode';

class UserProfileAPI {

    static userProfileEndPoint = `${Environment.apiUrl}/user-profiles`;
    static userEndPoint = `${Environment.apiUrl}/users`;

    static getUsername = (username) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/user-name/?username=${username}/`,
        });

        return apiCompletionPromise;
    };

    static get = (userId) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/${userId}/`,
        });

        return apiCompletionPromise;
    };

    static getUserContent = (userId, contentType) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/${userId}/${contentType}/`,
        });

        return apiCompletionPromise;
    };

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

    static authenticateRequests = (jwtToken, userId) => {

        if(!userId || !jwtToken || userId === "undefined" || jwtToken === "undefined") {
            return false;
        }

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('userId', userId);
        const decoded = jwtDecode(jwtToken);
        const currentDate = new Date();

        if((decoded.exp) <= currentDate ) {
            console.log('jwt expired');
            delete axios.defaults.headers.common['Authorization'];
            return false
        }

        if (jwtToken) {
            axios.defaults.headers.common['Authorization'] = `JWT ${jwtToken}`;
            return true;
        }
    };

    static logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default UserProfileAPI;
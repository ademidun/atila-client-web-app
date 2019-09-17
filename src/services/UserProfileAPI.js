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

    static createUser = (registrationData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: registrationData,
            url: `${this.userEndPoint}/`,
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

    static authenticateRequests = (jwtToken, userId) => {

        if(!this.isLoggedIn(userId, jwtToken)) {
            return false;
        }

        axios.defaults.headers.common['Authorization'] = `JWT ${jwtToken}`;
        return true;
    };

    static isLoggedIn(userId=null, jwtToken=null) {

        if(!userId) {
            userId = localStorage.getItem('userId');
        }if(!jwtToken) {
            jwtToken = localStorage.getItem('token');
        }

        if(!userId || !jwtToken || userId === "undefined" || jwtToken === "undefined") {
            delete axios.defaults.headers.common['Authorization'];
            return false;
        }

        const decoded = jwtDecode(jwtToken);
        const currentDate = new Date();

        if((decoded.exp * 1000) <= currentDate ) {
            console.log('jwt expired');
            delete axios.defaults.headers.common['Authorization'];
            return false
        }

        return true;

    }

    static logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        delete axios.defaults.headers.common['Authorization'];
    };


}

export default UserProfileAPI;
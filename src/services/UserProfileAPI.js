import request from 'axios';
import axios from 'axios';
import Environment from './Environment'
import jwtDecode from 'jwt-decode';
import GoogleAnalytics from "react-ga";
import AnalyticsService from "./AnalyticsService";
import {IP_DATA_URL} from "../models/Constants";

class UserProfileAPI {

    static userProfileEndPoint = `${Environment.apiUrl}/user-profiles`;
    static userProfileListEndPoint = `${Environment.apiUrl}/user-profile`;
    static userEndPoint = `${Environment.apiUrl}/users`;

    static getUsername = (username) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/user-name/?username=${username}/`,
        });

        return apiCompletionPromise;
    };

    static getUsernameAdminView = (username) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/admin-view/?username=${username}/`,
        });

        return apiCompletionPromise;
    };

    static verifyUserProfile = (userId, verificationData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: verificationData,
            url: `${this.userProfileEndPoint}/${userId}/verify-user-profile/`,
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
    /**
     * Used for paths that exist at the list level.
     * @param {*} pathName 
     */
    static list = (pathName, data={}, method="get") => {

        const requestSettings = {
            method,
            url: `${this.userProfileListEndPoint}/${pathName}/`,
        };

        if(data) {
            requestSettings.data = data;
        }

        const apiCompletionPromise = request(requestSettings);

        return apiCompletionPromise;
    };

    static removeSavedScholarship = (userId, scholarshipId) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/${userId}/remove-saved-scholarship/?scholarship=${scholarshipId}/`,
        });

        return apiCompletionPromise;
    };

    static refreshScholarshipCache = (userId) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {},
            url: `${this.userProfileEndPoint}/${userId}/refresh-scholarship-cache/`,
        });
        return apiCompletionPromise;
    };

    /**
     *
     * @param securityQuestionAndAnswer: {security_question: "", security_question_answer: ""}
     * @param userId
     * @returns {AxiosPromise}
     */
    static setSecurityQuestionAndAnswer = (securityQuestionAndAnswer, userId) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: securityQuestionAndAnswer,
            url: `${this.userProfileEndPoint}/${userId}/set-security-question-and-answer/`,
        });
        return apiCompletionPromise;
    };

    /**
     *
     * @param securityQuestionAndAnswer: {security_question_answer_attempt: ""}
     * @param userId
     * @returns {AxiosPromise}
     */
    static verifySecurityAnswer = (securityQuestionAndAnswer, userId) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: securityQuestionAndAnswer,
            url: `${this.userProfileEndPoint}/${userId}/verify-security-answer/`,
        });
        return apiCompletionPromise;
    };

    static createUser = async (registrationData) => {

        const registrationDataPost = registrationData;

        registrationDataPost.userProfile.metadata_private =  {
            geo_ip_registration: await AnalyticsService.getGeoIp(IP_DATA_URL),
            registration_path: window.location.pathname,
        };
        const apiCompletionPromise = request({
            method: 'post',
            data: registrationDataPost,
            url: `${this.userEndPoint}/`,
        });

        return apiCompletionPromise;
    };

    static update = (userProfileData, id) => {

        if(!userProfileData.locationData) {
            userProfileData.locationData =
                UserProfileAPI.getUserLocationData(userProfileData.userProfile);
        }
        const apiCompletionPromise = request({
            method: 'put',
            data: userProfileData,
            url: `${this.userProfileEndPoint}/${id}/`,
        });

        return apiCompletionPromise;
    };

    static patch = (data, id) => {

        const apiCompletionPromise = request({
            method: 'patch',
            data,
            url: `${this.userProfileEndPoint}/${id}/`,
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

    static getUserLocationData = (userProfile) => {

        const locationData = {};
        if (userProfile.city.length > 0) {
            locationData.city = userProfile.city[0].name;
            locationData.country = userProfile.city[0].country;
            locationData.province = userProfile.city[0].province;
        }
        return locationData;
    };

    static resetPassword = (username) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {username},
            url: `${this.userProfileEndPoint}/reset-password/`,
        });

        return apiCompletionPromise;
    };

    static verifyResetPassword = (username, token, password) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {username, token, password},
            url: `${this.userProfileEndPoint}/verify-reset-password/`,
        });

        return apiCompletionPromise;
    };

    static verifyToken = (username, token) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.userProfileEndPoint}/verify-token/?username=${username}&token=${token}`,
        });

        return apiCompletionPromise;
    };

    static authenticateRequests = (jwtToken, userId) => {

        if(!this.isLoggedIn(userId, jwtToken)) {
            return false;
        }

        GoogleAnalytics.set({userId});
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', jwtToken);
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
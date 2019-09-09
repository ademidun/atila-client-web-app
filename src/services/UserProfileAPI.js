import request from 'axios';
import Environment from './Environment'
class UserProfileAPI {

    static usersEndPoint = `${Environment.apiUrl}/user-profiles`;

    static getUsername = (username) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${this.usersEndPoint}/user-name/?username=${username}/`,
        });

        return apiCompletionPromise;
    }
}

export default UserProfileAPI;
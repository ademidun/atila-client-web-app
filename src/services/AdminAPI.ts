import Environment from "./Environment";
import request from "axios";

class AdminAPI {

    static ACTIONS = {
        SEND_EMAILS_IN_QUEUE: 'send-emails-in-queue'
    }
    static adminUrl = `${Environment.apiUrl}/helpers/admin`;
    static callAction = (actionPath: string, actionData: any = {}) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: actionData,
            url: `${AdminAPI.adminUrl}/${actionPath}/`,
        });

        return apiCompletionPromise;
    };

}

export default AdminAPI;
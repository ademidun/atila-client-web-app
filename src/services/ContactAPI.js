import request from "axios";
import Environment from './Environment'

class ContactAPI {
    static contactsApiUrl = `${Environment.apiUrl}/contact`;

    static create = (contact) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {contact},
            url: `${ContactAPI.contactsApiUrl}/`,
        });

        return apiCompletionPromise;
    };
}

export default ContactAPI
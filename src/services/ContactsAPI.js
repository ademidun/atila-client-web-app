import request from "axios";
import Environment from './Environment'

class ContactsAPI {
    static contactsApiUrl = `${Environment.apiUrl}/contact`;

    static create = (contact) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {contact},
            url: `${ContactsAPI.contactsApiUrl}/`,
        });

        return apiCompletionPromise;
    };

    static getAllContacts = () => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${ContactsAPI.contactsApiUrl}/contacts/query/`,
        });

        return apiCompletionPromise
    }

    static query = (queryData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: queryData,
            url: `${ContactsAPI.contactsApiUrl}/contacts/query/`,
        });

        return apiCompletionPromise
    }
}

export default ContactsAPI

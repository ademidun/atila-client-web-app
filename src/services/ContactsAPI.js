import request from "axios";
import Environment from './Environment'

class ContactsAPI {
    static contactsApiUrl = `${Environment.apiUrl}/contact`;

    static create = (contact) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: contact,
            url: `${ContactsAPI.contactsApiUrl}/contacts/`,
        });

        return apiCompletionPromise;
    };

    static update = (contact, id) => {

        const apiCompletionPromise = request({
            method: 'patch',
            data: contact,
            url: `${ContactsAPI.contactsApiUrl}/contacts/${id}/`,
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

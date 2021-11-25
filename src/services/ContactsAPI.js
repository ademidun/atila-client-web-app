import request from "axios";
import Environment from './Environment'

class ContactsAPI {
    static contactsApiUrl = `${Environment.apiUrl}/contact`;
    static contactsApiQueryUrl = `${Environment.apiUrl}/contact/contacts/query/`;
    static contactsApiQueryStudentClubsUrl = `${Environment.apiUrl}/contact/contacts/query-student-clubs/`;

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

    static query = (queryData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: queryData,
            url: ContactsAPI.contactsApiQueryUrl,
        });

        return apiCompletionPromise
    }

    static queryStudentClubs = (queryData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: queryData,
            url: ContactsAPI.contactsApiQueryStudentClubsUrl,
        });

        return apiCompletionPromise
    }
}

export default ContactsAPI

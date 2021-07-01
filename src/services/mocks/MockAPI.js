import Environment from '../Environment';
import ContactsAPI from '../ContactsAPI';
import ContactsQuery1 from './Contacts/ContactsQuery1.json';

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

export class MockAPI {

    static initializeMocks = () => {
        console.log("localStorage.getItem('ATILA_MOCK_API_CALLS'", localStorage.getItem('ATILA_MOCK_API_CALLS'));
        console.log("ContactsAPI.ContactsQuery", ContactsQuery1);

        if (localStorage.getItem('ATILA_MOCK_API_CALLS') !== "true" || Environment.name !== "dev") {
            if (localStorage.getItem('MOCK_API_CALLS') === "true") {
                console.log(`"User tried to use MOCK_API_CALLS local storage setting in" ${Environment.name} environment.
                This feature is only available in 'dev'`)
            }
            return
        }
        var mock = new MockAdapter(axios);
        mock.onGet(ContactsAPI.contactsApiQueryUrl).reply(200, ContactsQuery1);


    }
}
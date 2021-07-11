import Environment from '../Environment';
import ContactsAPI from '../ContactsAPI';
import ContactsQuery1 from './Contacts/ContactsQuery1.json';
import ScholarshipsPreview1 from './Scholarship/ScholarshipsPreview1.json';
import ScholarshipsPreviewOntario1 from './Scholarship/ScholarshipsPreviewOntario1.json';
import ScholarshipsPreviewPrairies1 from './Scholarship/ScholarshipsPreviewPrairies1.json';

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

export class MockAPI {

    static initializeMocks = () => {

        if (localStorage.getItem('ATILA_MOCK_API_CALLS') !== "true" || Environment.name !== "dev") {
            if (localStorage.getItem('MOCK_API_CALLS') === "true") {
                console.log(`"User tried to use MOCK_API_CALLS local storage setting in" ${Environment.name} environment.
                This feature is only available in 'dev'`)
            }
            return
        }
        var mock = new MockAdapter(axios);
        
        mock.onAny(ContactsAPI.contactsApiQueryUrl).reply(200, ContactsQuery1);

        mock.onPost(`${Environment.apiUrl}/scholarship-preview/?page=1`).reply(200, ScholarshipsPreviewPrairies1);

        mock.onAny(`${Environment.apiUrl}/scholarship-preview/?page=1`).reply(function (config) {
            // `config` is the axios config and contains things like the url
          
            // return an array in the form of [status, data, headers]
            const requestData = JSON.parse(config.data);
            console.log({config, requestData});

            let responseData = ScholarshipsPreview1;

            if (requestData.searchString && requestData.searchString?.toLowerCase() === "ontario") {
                responseData = ScholarshipsPreviewOntario1;
                console.log({ScholarshipsPreviewOntario1});
            }
            return [
              200,
              responseData,
            ];
          });


    }
}
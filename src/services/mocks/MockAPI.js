import Environment from '../Environment';
import ContactsAPI from '../ContactsAPI';
import ContactsQuery1 from './Contacts/ContactsQuery1.json';
import ScholarshipsPreview1 from './Scholarship/ScholarshipsPreview1.json';
import ScholarshipsPreviewOntario1 from './Scholarship/ScholarshipsPreviewOntario1.json';
import ScholarshipsPreviewPrairies1 from './Scholarship/ScholarshipsPreviewPrairies1.json';
import MendingTheChasmScholarship from './Scholarship/MendingTheChasmScholarship.json';
import SchulichLeaderScholarship from './Scholarship/SchulichLeaderScholarship.json';
import BlogPreviewList1 from './Blog/BlogPreviewList1.json';
import EmailSignupBlogPost from './Blog/EmailSignupBlogPost.json';
import WordCountBlogPost from './Blog/WordCountBlogPost.json';

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

export class MockAPI {

    static initializeMocks = () => {

        if (Environment.name === "prod") {
            if (localStorage.getItem('ATILA_MOCK_API_CALLS') === "true") {
                console.log(`"User tried to use ATILA_MOCK_API_CALLS local storage setting in" ${Environment.name} environment.
                This feature is only available in 'dev'`)
            }
            return
        }

        else if (Environment.name === "staging") {
            if (!window.location.host.includes("--atila-staging.netlify.app")) {
                return
            } else {
                console.log("Using mock data due to unique deploy url: '--atila-staging.netlify.app'")
            }
        }

        else if (Environment.name === "dev" && localStorage.getItem('ATILA_MOCK_API_CALLS') !== "true") {
            return
        }

        var mock = new MockAdapter(axios);
        
        mock.onAny(ContactsAPI.contactsApiQueryUrl).reply(200, ContactsQuery1);

        mock.onAny(`${Environment.apiUrl}/scholarship-preview/?page=1`).reply(function (config) {
            // `config` is the axios config and contains things like the url
          
            // return an array in the form of [status, data, headers]
            const requestData = JSON.parse(config.data);

            let responseData = ScholarshipsPreview1;

            if (requestData.searchString && requestData.searchString?.toLowerCase() === "ontario") {
                responseData = ScholarshipsPreviewOntario1;
            } else if (requestData.searchString && ["alberta", "saskatchewan", "winnipeg"].includes(requestData.searchString?.toLowerCase())) {
                responseData = ScholarshipsPreviewPrairies1;
            }
            return [
              200,
              responseData,
            ];
          });

        let scholarshipSlugUrl = `${Environment.apiUrl}/scholarship-slug`;
        scholarshipSlugUrl = new RegExp(`${scholarshipSlugUrl}/.+`);

        mock.onGet(scholarshipSlugUrl).reply(function (config) {

            let responseData = MendingTheChasmScholarship;

            if (config.url.includes("?slug=schulich")) {
                responseData = SchulichLeaderScholarship;
            }
            return [
              200,
              responseData,
            ];
          });


        let relatedBlogPostsUrl = `${Environment.apiUrl}/blog/blog-posts`;
        relatedBlogPostsUrl = new RegExp(`${relatedBlogPostsUrl}/.+/related/`);
        mock.onGet(relatedBlogPostsUrl).reply(200, BlogPreviewList1);
        mock.onGet(`${Environment.apiUrl}/blog/blog-posts/?page=1`).reply(200, BlogPreviewList1);
        mock.onGet(`${Environment.apiUrl}/blog/blog/llmercer/how-we-designed-the-atila-black-and-indigenous-scholarship-graphic/`).reply(200, {blog: BlogPreviewList1.results[0]});
        mock.onGet(`${Environment.apiUrl}/blog/blog/alona/use-your-personal-email-preferably-gmail-not-your-school-email-when-signing-up-for-an-account-on-atila/`).reply(200, EmailSignupBlogPost);
        mock.onGet(`${Environment.apiUrl}/blog/blog/ericwang451/whats-the-word-count-analyzing-the-correlation-between-essay-length-and-quality/`).reply(200, WordCountBlogPost);


    }
}
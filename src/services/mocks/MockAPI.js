import Environment from '../Environment';
import ContactsAPI from '../ContactsAPI';
import ContactsQuery1 from './Contacts/ContactsQuery1.json';
import ScholarshipsPreview1 from './Scholarship/ScholarshipsPreview1.json';
import ScholarshipsPreviewOntario1 from './Scholarship/ScholarshipsPreviewOntario1.json';
import ScholarshipsPreviewPrairies1 from './Scholarship/ScholarshipsPreviewPrairies1.json';
import MendingTheChasmScholarship from './Scholarship/MendingTheChasmScholarship.json';
import TopScholarNotionPage from './Notion/TopScholar.json';
import SchulichLeaderScholarship from './Scholarship/SchulichLeaderScholarship.json';
import AynRandScholarship from './Scholarship/AynRandScholarship.json';
import BlogPreviewList1 from './Blog/BlogPreviewList1.json';
import EmailSignupBlogPost from './Blog/EmailSignupBlogPost.json';
import WordCountBlogPost from './Blog/WordCountBlogPost.json';
import ScholarshipGuideBlogPost from './Blog/ScholarshipGuideBlogPost.json';
import AllFinalists from './Application/AllFinalists.json';
import ApplicationFinalistSTEM from './Application/ApplicationFinalistSTEM.json';
import NotionService from '../NotionService';

import UserProfileTomiwa from './UserProfile/UserProfileTomiwa.json';
import UserProfileContributions from './UserProfile/UserProfileContributions.json';
import UserProfileBlogs from './UserProfile/UserProfileBlogs.json';
import UserProfileEssays from './UserProfile/UserProfileEssays.json';
import UserProfileReferrals from './UserProfile/UserProfileReferrals.json';
import UserProfileApplications from './UserProfile/UserProfileApplications.json';
import MentorEventTypes from './Mentorship/MentorEventTypes.json';
import CalendlyAccessToken from './Mentorship/CalendlyAccessToken.json';
import MentorProfile from './Mentorship/MentorProfile.json';
import MentorsList from './Mentorship/MentorsList.json';

import EssaysPage1 from './Essay/EssaysPage1.json';
import ApplicationsAPI from '../ApplicationsAPI';
import AnalyticsService from '../AnalyticsService';
import { toastNotify } from '../../models/Utils';
import ScheduleAPI from '../ScheduleAPI';

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

export class MockAPI {

    static ATILA_MOCK_API_CALLS = "ATILA_MOCK_API_CALLS";

    constructor() {

        const atilaMockApiCallsLocalStorageValue = localStorage.getItem(MockAPI.ATILA_MOCK_API_CALLS);

        if (["prod", "demo"].includes(Environment.name)) {
            if (atilaMockApiCallsLocalStorageValue === "true") {
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

        else if (Environment.name === "dev" && atilaMockApiCallsLocalStorageValue !== "true") {
            return
        }
        this.mock = new MockAdapter(axios);
        const notificationMessage = "MockAPI is being used";
        console.log(notificationMessage);
        toastNotify(notificationMessage)
    }

    initializeMocks = () => {

        this.mock.onAny(ContactsAPI.contactsApiQueryUrl).reply(200, ContactsQuery1);
        this.mock.onAny(ContactsAPI.contactsApiQueryStudentClubsUrl).reply(200, ContactsQuery1);

        this.mock.onAny(AnalyticsService.pageViewsUrl).reply(200, {});

        this.mock.onAny(`${Environment.apiUrl}/scholarship-preview/?page=1`).reply(function (config) {
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

        this.mock.onGet(scholarshipSlugUrl).reply(function (config) {

            let responseData = MendingTheChasmScholarship;

            if (config.url.includes("?slug=schulich")) {
                responseData = SchulichLeaderScholarship;
            }

            else if (config.url.includes("?slug=ayn-rand")) {
                responseData = AynRandScholarship;
            }
            return [
              200,
              responseData,
            ];
          });


        let relatedBlogPostsUrl = `${Environment.apiUrl}/blog/blog-posts`;
        relatedBlogPostsUrl = new RegExp(`${relatedBlogPostsUrl}/.+/related/`);
        this.mock.onGet(relatedBlogPostsUrl).reply(200, BlogPreviewList1);

        this.mock.onGet(`${Environment.apiUrl}/blog/blog-posts/?page=1`).reply(200, BlogPreviewList1);
        this.mock.onGet(`${Environment.apiUrl}/blog/blog/llmercer/how-we-designed-the-atila-black-and-indigenous-scholarship-graphic/`).reply(200, {blog: BlogPreviewList1.results[0]});
        this.mock.onGet(`${Environment.apiUrl}/blog/blog/alona/use-your-personal-email-preferably-gmail-not-your-school-email-when-signing-up-for-an-account-on-atila/`).reply(200, EmailSignupBlogPost);
        this.mock.onGet(`${Environment.apiUrl}/blog/blog/ericwang451/whats-the-word-count-analyzing-the-correlation-between-essay-length-and-quality/`).reply(200, WordCountBlogPost);
        this.mock.onGet(`${Environment.apiUrl}/blog/blog/tomiwa/atila-scholarship-guide/`).reply(200, ScholarshipGuideBlogPost);
        this.mock.onGet(`${ApplicationsAPI.applicationsApiUrl}/all-finalists/?page=1/`).reply(200, AllFinalists);
        this.mockApplicationGet();

        let essayApiUrl = `${Environment.apiUrl}/essay`
        let essayListApiUrl = new RegExp(`${essayApiUrl}/essays/\\?page=.+`);
        let essayDetailApiUrl = new RegExp(`${essayApiUrl}/essay/.+/.+/$`);
        let essayRelatedApiUrl = new RegExp(`${essayApiUrl}/essays/.+/related/`);

        this.mock.onGet(essayListApiUrl).reply(200, EssaysPage1);
        this.mock.onGet(essayDetailApiUrl).reply(200, {essay: EssaysPage1.results[1]});
        this.mock.onGet(essayRelatedApiUrl).reply(200, EssaysPage1);

        let mentorsApiUrl = `${Environment.apiUrl}/mentorship/mentors/`;
        console.log({mentorsApiUrl});
        this.mock.onGet(mentorsApiUrl).reply(200, MentorsList);

        let notionPageUrl = `${NotionService.pageIdUrl}`;
        notionPageUrl = new RegExp(`${notionPageUrl}/.+`);
        this.mock.onGet(notionPageUrl).reply(200, TopScholarNotionPage);

        let userProfileAPIBaseUrl = `${Environment.apiUrl}/user-profiles`;

        const userProfileContentMap = {
            referrals: UserProfileReferrals,
            applications: UserProfileApplications,
            essays: UserProfileEssays,
            blogs: UserProfileBlogs,
            contributions: UserProfileContributions,
            scholarships: {scholarships: ScholarshipsPreview1.data},
            created_scholarships: {created_scholarships: ScholarshipsPreview1.data},
            mentor: {mentor: MentorProfile},
        }
        for (const [userProfileRoute, response] of Object.entries(userProfileContentMap)) {
            let userProfileDetailAttributeUrl = new RegExp(`${userProfileAPIBaseUrl}/.+/${userProfileRoute}/`);

            this.mock.onGet(userProfileDetailAttributeUrl).reply(200, response);
        }
        
        let userProfileDetailUrl = new RegExp(`${userProfileAPIBaseUrl}/.+/$`);
        this.mock.onGet(userProfileDetailUrl).reply(200, UserProfileTomiwa);
        let doesApplicationExistUrl = new RegExp(`${ApplicationsAPI.applicationsApiUrl}/does-application-exist/.+/$`);
        this.mock.onGet(doesApplicationExistUrl).reply(200, {});


        this.mock.onAny(`${ScheduleAPI.apiUrl}/get-calendly-access-token/`).reply(200, CalendlyAccessToken);

        // When using RegExp the variable needs to be separated from the regex part (TODO: check git blame or internet for why this change was necessary)
        // TODO this regex doesn't actually work, FIX IT
        let calendlyApiUrl = `${ScheduleAPI.calendlyApiUrl}/event_types`
        let scheduleEventTypesUrl = new RegExp(`${calendlyApiUrl}/\\?user=.+`);
        this.mock.onGet(scheduleEventTypesUrl).reply(200, MentorEventTypes);
    }

    mockApplicationGet = (application = ApplicationFinalistSTEM, status= 200) => {
        this.mock.onGet(`${ApplicationsAPI.applicationsApiUrl}/${application.id}/`).reply(status, application);
    }
}

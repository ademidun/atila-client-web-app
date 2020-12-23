import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMd} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {BlogWhatIsAtila} from "./Blog";
import {EssayIveyApplication} from "./Essay";
import {ScholarshipEngineering} from "./Scholarship";
import {genericItemTransform} from "../services/utils";
import {UserProfileTest1} from "./UserProfile";

// todo there might be an npm package for this!
// todo add more emojis to the dictionary

export const MAX_BLOG_PAGE_VIEWS = 5;
export const MAX_ESSAY_PAGE_VIEWS = 3;
export const MAX_SCHOLARSHIP_PAGE_VIEWS = 10;

export const ATILA_SCHOLARSHIP_FEE = 0.09;
export const ATILA_SCHOLARSHIP_FEE_TAX = 0.13;
export const ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_START_SCHOLARSHIP = 50;
export const ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP = 10;


export const EBOOK_AUDIENCE_IMAGES = {
    '1': {
        name: 'default',
        ebookLandingImage: 'https://i.imgur.com/PMg68If.png',
        ebookMultipleDevices: 'https://i.imgur.com/CwPiFjJ.png',
        bookCoverImage: 'https://i.imgur.com/kkV3Cra.png',
        seoImage: 'https://i.imgur.com/w7qc7gQ.png',
    },
    '2': {
        name: 'east-asian',
        ebookLandingImage: 'https://i.imgur.com/Y2GsEBf.png',
        ebookMultipleDevices: 'https://i.imgur.com/sXj8xYA.png',
        bookCoverImage: 'https://i.imgur.com/KdYNLId.png',
        seoImage: 'https://i.imgur.com/EO6FA0r.png',
    },
    '3': {
        name: 'south-east-asian',
        ebookLandingImage: 'https://i.imgur.com/IdS3Dy8.png',
        ebookMultipleDevices: 'https://i.imgur.com/7jJlBRf.png',
        bookCoverImage: 'https://i.imgur.com/JRpVcyh.png',
        seoImage: 'https://i.imgur.com/56jt7rU.png',
    },
    '4': {
        name: 'black',
        ebookLandingImage: 'https://imgur.com/5b7freh.png',
        ebookMultipleDevices: 'https://imgur.com/YXVmRGQ.png',
        bookCoverImage: 'https://imgur.com/SLFwXcy.png',
        seoImage: 'https://i.imgur.com/dfoocUY.png',
    }
};

export const emojiDictionary = {
    'aboriginal/first nations': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">🙋🏽‍♂</span>,
    'asian/east-asian': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">️🙋🏻 </span>,
    'black/african-american': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">🙋🏿 </span>,
    'indian/south-asian': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">🙋🏾‍♂️️</span>,
    'latino/hispanic': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">🙋🏾‍♂️️</span>,
    'middle eastern': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">🙋🏽️</span>,
    'visible minority': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">🙋🏾‍♂️️</span>,
    'white/caucasian': <span role="img" className="text-dark" aria-label="ethnic hand raised emoji">🙋‍♂️</span>,
    china: <span role="img" className="text-dark" aria-label="china emoji">🇨🇳</span>,
    nigeria: <span role="img" className="text-dark" aria-label="nigeria emoji">🇳🇬</span>,
    canada: <span role="img" className="text-dark" aria-label="canada emoji">🇨🇦</span>,
    india: <span role="img" className="text-dark" aria-label="india emoji">🇮🇳</span>,
    basketball: <span role="img" className="text-dark" aria-label="basketball emoji">🏀</span>,
    soccer: <span role="img" className="text-dark" aria-label="soccer emoji">⚽</span>,
    'creative writing': <span role="img" className="text-dark" aria-label="creative writing emoji">📝</span>,
    'software engineering': <span role="img" className="text-dark" aria-label="software engineering emoji">💻</span>,
    biology: <span role="img" className="text-dark" aria-label="biology emoji">🔬</span>,
    'university of western ontario': <span role="img" className="text-dark" aria-label="mustang emoji">💜 🐎</span>,
    'ivey business school': <span role="img" className="text-dark" aria-label="ivey emoji">💚 🌲</span>,
    medicine: <FontAwesomeIcon icon={faUserMd} className="mr-1"/>,
};
export const initialReduxState = {
    data: {
        user: {
            loggedInUserProfile: null
        }
    },
    ui: {
        user: {
            isLoadingLoggedInUserProfile: false
        }
    }
};
export const initialReduxStateLoggedIn = {
    data: {
        user: {
            loggedInUserProfile: UserProfileTest1
        }
    },
    ui: {
        user: {
            isLoadingLoggedInUserProfile: false
        }
    }
};
export const relatedItems = [
    BlogWhatIsAtila,
    EssayIveyApplication,
    ScholarshipEngineering].map((item, index) => {
    return {
        ...genericItemTransform(item),
        id: index
        // React components require unique Ids (usually index shouldn't be the ID but its fine for testing)
    }
});

export const RESERVED_USERNAMES = ['edit', 'settings', 'blog', 'essays', 'scholarships'];

// use 2 different URLS to increase the amount of available quota
export const IP_GEO_LOCATION_URL = 'https://api.ipgeolocation.io/ipgeo?apiKey=defa481e93f84d4196dbf19426ab0c51';
export const IP_DATA_URL = 'https://api.ipdata.co/?api-key=335beb2ad17cc12676f2792328a5a770c47b89d6768daf9ec2c4d866';

export const SEARCH_ANALYTICS_RESULTS_SCHOLARSHIP = {
    search_payload: {
        searchString: "University of Western Ontario",
        previewMode: "universalSearch",
        filter_by_user_show_eligible_only: true,
        sort_by: "relevance_new"
    },
    results_count: 14,
    funding: 186550,
    type: "scholarships"
};
export const SEARCH_ANALYTICS_RESULTS_ENGINEERING = {
    search_query: "engineering",
    metadata: {
        scholarships: {
            omit_results: true,
            total_results_count: 58,
            results_limit: 3
        },
        blogPosts: {
            omit_results: true,
            total_results_count: 4,
            results_limit: 3
        },
        essays: {
            omit_results: false
        }
    },
    results_count: {
        scholarships: 3,
        blogPosts: 3,
        essays: 3
    },
    type: "search"
};

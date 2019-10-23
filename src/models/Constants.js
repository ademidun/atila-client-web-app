import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMd} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const STRIPE_PUBLIC_KEY = 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM';
// const STANDARD_PRODUCT_ID = "";
// const PREMIUM_PRODUCT_ID = "";
// todo there might be an npm package for this!
// todo add more emojis to the dictionary
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
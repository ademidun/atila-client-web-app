import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMd} from "@fortawesome/free-solid-svg-icons";
import React from "react";

// todo there might be an npm package for this!
// todo add more emojis to the dictionary
export const emojiDictionary = {
    china: <span role="img" aria-label="china emoji">🇨🇳</span>,
    nigeria: <span role="img" aria-label="nigeria emoji">🇳🇬</span>,
    canada: <span role="img" aria-label="canada emoji">🇨🇦</span>,
    basketball: <span role="img" aria-label="basketball emoji">🏀</span>,
    soccer: <span role="img" aria-label="soccer emoji">⚽</span>,
    'creative writing': <span role="img" aria-label="creative writing emoji">📝</span>,
    'software engineering': <span role="img" aria-label="software engineering emoji">💻</span>,
    biology: <span role="img" aria-label="biology emoji">🔬</span>,
    'university of western ontario': <span role="img" aria-label="mustang emoji">💜 🐎</span>,
    'ivey business school': <span role="img" aria-label="ivey emoji">💚 🌲</span>,
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
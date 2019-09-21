import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMd} from "@fortawesome/free-solid-svg-icons";
import React from "react";

// todo there might be an npm package for this!
export const emojiDictionary = {
    china: <span role="img" aria-label="china emoji">🇨🇳</span>,
    canada: <span role="img" aria-label="canada emoji">🇨🇦</span>,
    basketball: <span role="img" aria-label="basketball emoji">🏀</span>,
    biology: <span role="img" aria-label="biology emoji">🔬</span>,
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
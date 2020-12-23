import PropTypes from 'prop-types';

import {toast} from 'react-toastify';
import {
    ACTIVITIES,
    COUNTRIES,
    DISABILITIES,
    ETHNICITIES,
    LANGUAGES,
    MAJORS_LIST,
    RELIGIONS,
    SCHOOLS_LIST,
    SPORTS
} from "./ConstantsForm";

export const InputConfigPropType = PropTypes.shape({
    type: PropTypes.string,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({}),
    ]),
    html: PropTypes.func,
    isHidden: PropTypes.func,
    suggestions: PropTypes.array,
    className: PropTypes.string,
});

export const toastNotify = (message, messageType='info', customOptions={}) => {

    const options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...customOptions
    };

    // I could refactor this to make it more concise but then I would lose the typechecking and inspection benefits.
    if(messageType==='error') {

        if (message.toLowerCase().includes("signature has expired")){
            message += "\nTry refreshing page or logging out then logging back in.";
        }

        toast.error(message, options);
    } else {
        toast.info(message, options);
    }

};
export const scholarshipUserProfileSharedFormConfigs = [
    {
        keyName: 'activities',
        placeholder: 'Activities 👩🏽‍🎨 📝 🎤 🔬',
        type: 'autocomplete',
        suggestions: ACTIVITIES,
    },
    {
        keyName: 'ethnicity',
        placeholder: 'Ethnicity (e.g. Aboriginal, Asian, Black, South Asian) 🙋🏽‍♂️🙋🏻 🙋🏿 🙋🏾‍♂️️',
        type: 'autocomplete',
        suggestions: ETHNICITIES,
    },
    {
        keyName: 'religion',
        placeholder: 'Religion 🙏🏿 (e.g. Christianity, Sikhism, Islam)',
        type: 'autocomplete',
        suggestions: RELIGIONS,
    },
    {
        keyName: 'citizenship',
        placeholder: 'Citizenship or Permanent Residency 🌏',
        type: 'autocomplete',
        suggestions: COUNTRIES,
    },
    {
        keyName: 'disability',
        placeholder: 'Disability ♿️',
        type: 'autocomplete',
        suggestions: DISABILITIES,
    },
    {
        keyName: 'sports',
        placeholder: 'Sports 🏀 ⛹🏿 ⚽ 🏸',
        type: 'autocomplete',
        suggestions: SPORTS,
    },
    {
        keyName: 'language',
        placeholder: 'Languages 🗣',
        type: 'autocomplete',
        suggestions: LANGUAGES,
    },
    {
        keyName: 'heritage',
        placeholder: 'Heritage (India, Nigeria, China) 🇮🇳 🇳🇬 🇨🇳',
        type: 'autocomplete',
        suggestions: COUNTRIES,
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Any other schools? 🏫',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST,
    },
    {
        keyName: 'eligible_programs',
        placeholder: 'Any other Programs? 📚',
        type: 'autocomplete',
        suggestions: MAJORS_LIST,
    }
];

// TODO get this list from a propert third party source
export const forbiddenCharacters = ["+", "%", "$", "&", "~", "/", "\\"];

export const hasForbiddenCharacters = (testSequence) => {
    for (let i = 0; i < forbiddenCharacters.length; i++) {
        if (testSequence.includes(forbiddenCharacters[i])) {
            return true
        }
    }

    return false
};

export const handleButtonClickEventFacebook = (event) => {

    let eventName = event.target.name;

    if('SubscribeBtn' === eventName) {
        eventName = 'Lead';
    }

    if('PreviewBook' === eventName) {
        eventName = 'ViewContent';
    }

    if('AddToCart' === eventName) {
        eventName = 'InitiateCheckout';
    }

    if (window.fbq) {
        window.fbq('track', eventName);
    }
};
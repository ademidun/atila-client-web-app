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
import React from "react";

export const InputConfigPropType = PropTypes.shape({
    type: PropTypes.string,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    html: PropTypes.func,
    suggestions: PropTypes.array,
    className: PropTypes.string,
});

export const toastNotify = (message, messageType='info') => {

    const options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    };

    // I could refactor this to make it more concise but then I would lose the typechecking and inspection benefits.
    if(messageType==='error') {
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
        className: 'col-md-6',
    },
    {
        keyName: 'ethnicity',
        placeholder: 'Ethnicity (e.g. Aboriginal, Asian, Black, South Asian) 🙋🏽‍♂️🙋🏻 🙋🏿 🙋🏾‍♂️️',
        type: 'autocomplete',
        suggestions: ETHNICITIES,
        className: 'col-md-6',
    },
    {
        keyName: 'religion',
        placeholder: 'Religion 🙏🏿',
        type: 'autocomplete',
        suggestions: RELIGIONS,
        className: 'col-md-6',
    },
    {
        keyName: 'citizenship',
        placeholder: 'Citizenship or Permanent Residency 🌏',
        type: 'autocomplete',
        suggestions: COUNTRIES,
        className: 'col-md-6',
    },
    {
        keyName: 'disability',
        placeholder: 'Disability ♿️',
        type: 'autocomplete',
        suggestions: DISABILITIES,
        className: 'col-md-6',
    },
    {
        keyName: 'sports',
        placeholder: 'Sports 🏀 ⛹🏿 ⚽ 🏸',
        type: 'autocomplete',
        suggestions: SPORTS,
        className: 'col-md-6',
    },
    {
        keyName: 'language',
        placeholder: 'Languages 🗣',
        type: 'autocomplete',
        suggestions: LANGUAGES,
        className: 'col-md-6',
    },
    {
        keyName: 'heritage',
        placeholder: 'Heritage (Indian, Nigerian, Chinese) 🇮🇳 🇳🇬 🇨🇳',
        type: 'autocomplete',
        suggestions: COUNTRIES,
        className: 'col-md-6',
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Eligible Schools (leave blank for any) 🏫',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST,
        className: 'col-md-6',
    },
    {
        keyName: 'eligible_programs',
        placeholder: 'Eligible Programs (leave blank for any) 📚',
        type: 'autocomplete',
        suggestions: MAJORS_LIST,
        className: 'col-md-6',
    },
    {
        keyName: 'criteria_info',
        type: 'textarea',
        placeholder: 'Additional Information',
        html: () => (<label htmlFor="description">
            Everything else you want people to know about the scholarship, put it here
            <span role="img" aria-label="pointing down emoji">
            👇🏿
            </span>
        </label>),
    },
];
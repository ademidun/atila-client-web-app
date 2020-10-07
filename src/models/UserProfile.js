import {GRADE_LEVELS, MAJORS_LIST, SCHOOLS_LIST} from "./ConstantsForm";
import PropTypes from "prop-types";

export const UserProfileTest1 = {
    username: 'cbarkley',
    first_name: 'Charles',
    last_name: 'Barkley',
    major: 'Basketball',
    id: 1,
    user: 1,
    is_atila_admin: false,
    is_debug_mode: false,
    eligible_programs: [],
    saved_scholarships: [],
};

export const userProfileFormOnboarding = [
    {
        keyName: 'major',
        type: 'autocomplete_single',
        suggestions: MAJORS_LIST,
    },
    {
        keyName: 'eligible_programs',
        placeholder: 'Any other Programs? 📚',
        type: 'autocomplete',
        suggestions: MAJORS_LIST,
    },
    {
        keyName: 'post_secondary_school',
        type: 'autocomplete_single',
        suggestions: SCHOOLS_LIST,
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Any other schools? 🏫',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST,
    },
    {
        keyName: 'gender',
        type: 'select',
        options: ['Male', 'Female', 'Other']
    },
    {
        keyName: 'city',
        type: 'location',
        valueDisplay: model => model.city[0] && model.city[0].name,
    },
    {
        keyName: 'province',
        type: 'location',
        valueDisplay: model => model.province[0] && model.province[0].name,
    },
    {
        keyName: 'country',
        type: 'location',
        valueDisplay: model => model.country[0] && model.country[0].name,
    },
];

export const userProfileFormConfig = [
    {
        keyName: 'first_name',
    },
    {
        keyName: 'last_name',
    },
    {
        keyName: 'email',
        type: 'email'
    },
    {
        keyName: 'major',
        type: 'autocomplete_single',
        suggestions: MAJORS_LIST,
    },
    {
        keyName: 'eligible_programs',
        placeholder: 'Any other Programs? 📚',
        type: 'autocomplete',
        suggestions: MAJORS_LIST,
    },
    {
        keyName: 'post_secondary_school',
        type: 'autocomplete_single',
        suggestions: SCHOOLS_LIST,
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Any other schools? 🏫',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST,
    },
    {
        keyName: 'grade_level',
        type: 'select',
        options: GRADE_LEVELS
    },
    {
        keyName: 'gender',
        type: 'select',
        options: ['Male', 'Female', 'Other']
    },
    {
        keyName: 'city',
        type: 'location',
        valueDisplay: model => model.city[0] && model.city[0].name,
    },
    {
        keyName: 'province',
        type: 'location',
        valueDisplay: model => model.province[0] && model.province[0].name,
    },
    {
        keyName: 'country',
        type: 'location',
        valueDisplay: model => model.country[0] && model.country[0].name,
    },
];

export function isCompleteUserProfile(userProfile) {

    return (userProfile.post_secondary_school || userProfile.eligible_schools.length !== 0) &&
        (userProfile.major || userProfile.eligible_programs.length !== 0)
}

export function addToMyScholarshipHelper(userProfile, scholarship) {

    if (!userProfile.saved_scholarships) {
        userProfile.saved_scholarships = [];
        userProfile.saved_scholarships_metadata = {};
    }

    userProfile.saved_scholarships.push(scholarship.id);
    userProfile.saved_scholarships_metadata[scholarship.id] = {notes: ''};

    return userProfile;
}
export const UserProfilePropType = PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    is_atila_admin: PropTypes.boolean,
    is_debug_mode: PropTypes.boolean,
    stripe_customer_id: PropTypes.string,
    stripe_connected_account_id: PropTypes.string,
});
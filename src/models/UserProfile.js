import {GRADE_LEVELS, MAJORS_LIST, SCHOOLS_LIST} from "./ConstantsForm";

export const UserProfileTest1 = {
    username: 'cbarkley',
    first_name: 'Charles',
    last_name: 'Barkley',
    id: 1,
};

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
    },
    {
        keyName: 'province',
    },
    {
        keyName: 'country',
    },
];

export function isCompleteUserProfile(userProfile) {

    return (userProfile.post_secondary_school || userProfile.eligible_schools.length !== 0) &&
        (userProfile.major || userProfile.eligible_programs.length !== 0)
}
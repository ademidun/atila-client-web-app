import {GRADE_LEVELS} from "./ConstantsForm";

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
    },
    {
        keyName: 'major',
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
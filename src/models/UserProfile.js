import {MAJORS_LIST, SCHOOLS_LIST} from "./ConstantsForm";
import React from "react";

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
    },
    {
        keyName: 'gender',
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
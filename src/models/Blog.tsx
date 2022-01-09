import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {UserProfileTest1} from "./UserProfile";
import { Wallet } from './Wallet.class';

export interface Blog {
    id: number,
    header_image_url: string,
    title: string,
    slug: string,
    description: string,
    body: ReactElement<any, any> | string,
    user?: {
        id: number,
        first_name: string,
        username: string,
        last_name: string,
        profile_pic_url: string,
    },
    contributors?: Array <any>,
    wallet?: string | null;
    wallet_detail?: Wallet | null;
}

export const BlogPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    header_image_url: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    user: PropTypes.shape({
        first_name: PropTypes.number,
        last_name: PropTypes.string,
        id: PropTypes.number,
        username: PropTypes.string,
        profile_pic_url: PropTypes.string,
    }),
});

export const BlogWhatIsAtila : Blog = {
    id: 789758,
    header_image_url: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/' +
        'o/public%2Fatila-scholarship-default-image.jpeg?alt=media&token=cd789758-3400-43d5-9ea7-d2facf709ea2',
    title: 'What is Atila?',
    slug: 'what-is-atila',
    description: 'Scholarship only for awesome engineering students',
    body:
        <div>
            A blog post explaining what Atila does is and why we created it.
        </div>
    ,
    user: {
        id: 1,
        first_name: 'Tomiwa',
        username: 'tomiwa',
        last_name: 'Ademidun',
        profile_pic_url: "",
    },
    contributors: [UserProfileTest1],
    wallet: null,
    wallet_detail: null,
};

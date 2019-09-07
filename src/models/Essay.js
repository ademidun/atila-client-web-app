import PropTypes from 'prop-types';
import React from "react";


export const EssayPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    essay_source_url: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    user: PropTypes.shape({
        first_name: PropTypes.number,
        last_name: PropTypes.string,
        id: PropTypes.number,
        username: PropTypes.string,
        profile_pic_url: PropTypes.string,
    }),
});


export const EssayIveyApplication = {
    id: 789758,
    essay_source_url: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/' +
        'o/public%2Fatila-scholarship-default-image.jpeg?alt=media&token=cd789758-3400-43d5-9ea7-d2facf709ea2',
    title: 'Ivey AEO Application 2017',
    slug: 'ivey-aeo-application-2017',
    description: 'How I got into Ivey',
    body:
        <div>
            A blog post explaining what Atila does is and why we created it.
        </div>
    ,
    user: {
        first_name: 'Tomiwa',
        username: 'tomiwa',
        last_name: 'Ademidun',
    }

};

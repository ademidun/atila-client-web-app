import React from 'react';
import PropTypes from 'prop-types';


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

export const BlogWhatIsAtila = {
    id: 1,
    header_image_url: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/' +
        'o/public%2Fatila-scholarship-default-image.jpeg?alt=media&token=cd789758-3400-43d5-9ea7-d2facf709ea2',
    title: 'What is Atila?',
    description: 'Scholarship only for awesome engineering students',
    body:
        <div>
            A blog post explaining what Atila does is and why we created it.
        </div>
    ,

};

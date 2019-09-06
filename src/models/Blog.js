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

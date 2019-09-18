import PropTypes from 'prop-types';

export const InputConfigPropType = PropTypes.shape({
    type: PropTypes.string,
    key: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    html: PropTypes.element,
});
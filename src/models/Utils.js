import PropTypes from 'prop-types';

export const InputConfigPropType = PropTypes.shape({
    type: PropTypes.string,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    html: PropTypes.func,
    suggestions: PropTypes.array,
});
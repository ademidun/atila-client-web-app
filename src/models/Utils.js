import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

export const InputConfigPropType = PropTypes.shape({
    type: PropTypes.string,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    html: PropTypes.func,
    suggestions: PropTypes.array,
});

export const toastNotify = (message) => toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});
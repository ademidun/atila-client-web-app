import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

export const InputConfigPropType = PropTypes.shape({
    type: PropTypes.string,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    html: PropTypes.func,
    suggestions: PropTypes.array,
    className: PropTypes.string,
});

export const toastNotify = (message, messageType='info') => {

    const options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    };

    // I could refactor this to make it more concise but then I would lose the typechecking and inspection benefits.
    if(messageType==='error') {
        toast.error(message, options);
    } else {
        toast.info(message, options);
    }

}
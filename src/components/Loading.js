import React from 'react'
import PropTypes from 'prop-types';
import BarLoader from "react-spinners/BarLoader";
import BeatLoader from "react-spinners/BeatLoader";

/**
 * @return {null}
 */
function Loading({isLoading , title, className, loaderType, width}) {

    if (!isLoading) {
        return null;
    }

    let LoadingComponent = BarLoader;

    if(loaderType==='beat') {
        LoadingComponent = BeatLoader;
    }

    return (<div className={`text-center ${className}`}>
        <h5>{title}</h5>
        <div className="center-block">
            <LoadingComponent className="center-block"
                              color={'#0b9ef5'} height={7} width={width}/>
        </div>
    </div>)
}

Loading.defaultProps = {
    isLoading: true,
    title: "Loading Atila.ca",
    className: "mt-3",
    loaderType: "bar",
    width: 'auto',
};
Loading.propTypes = {
    isLoading: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    title: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    loaderType: PropTypes.oneOf(['bar', 'beat']),
};
export default Loading;
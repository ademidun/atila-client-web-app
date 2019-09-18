import React from 'react'
import PropType from 'prop-types';
import BarLoader from "react-spinners/BarLoader";
import BeatLoader from "react-spinners/BeatLoader";

/**
 * @return {null}
 */
function Loading({isLoading , title, className, loaderType, style}) {

    if (!isLoading) {
        return null;
    }

    let LoadingComponent = BarLoader;

    if(loaderType==='beat') {
        LoadingComponent = BeatLoader;
    }

    return (<div className={`text-center ${className}`}>
        <h5>{title}</h5>
        <div className="center-block" style={style}>
            <LoadingComponent className="center-block"
                              color={'#0b9ef5'} height={7} width={500}/>
        </div>
    </div>)
}

Loading.defaultProps = {
    isLoading: true,
    title: "Loading Application",
    className: "mt-3",
    loaderType: "bar",
    style: { width: '500px' },
};
Loading.propTypes = {
    isLoading: PropType.bool,
    title: PropType.string,
    className: PropType.string,
    style: PropType.shape({}),
    loaderType: PropType.oneOf(['bar', 'beat']),
};
export default Loading;
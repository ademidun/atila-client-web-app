import React from 'react'
import BarLoader from "react-spinners/BarLoader";

/**
 * @return {null}
 */
function Loading({isLoading = true, title = "", className = "mt-3" }) {

    if (!isLoading) {
        return null;
    }

    return (<div className={`text-center ${className}`}>
        <h5>{title}</h5>
        <div className="center-block" style={{ width: '500px' }}>
            <BarLoader className="center-block"
                       color={'#0b9ef5'} height={7} width={500}/>
        </div>
    </div>)
}

export default Loading;
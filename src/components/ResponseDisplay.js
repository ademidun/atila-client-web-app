import React from 'react';
import Loading from "./Loading";


function ResponseDisplay( {isLoadingResponse, responseOkMessage, responseError} ){

    return (
        <React.Fragment>
            {responseOkMessage &&
            <p className="text-success">
                {responseOkMessage}
            </p>
            }
            {responseError &&
            <p className="text-danger">
                {responseError.message || responseError}
            </p>
            }
            {isLoadingResponse &&
            <Loading title="Loading Response..." className="center-block my-3"/>
            }
        </React.Fragment>
    )
}

export default ResponseDisplay;
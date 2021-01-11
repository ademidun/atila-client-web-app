import React from 'react';

import ApplicationsAPI from "../services/ApplicationsAPI";
import ContentList from "./ContentList";

class FinalistsList extends React.Component {

    render () {
        return (
            <ContentList ContentAPI={ApplicationsAPI} contentType={'Essays'} />
        );
    }
}

export default FinalistsList;
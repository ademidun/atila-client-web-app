import React from 'react';

import EssaysAPI from "../../services/EssaysAPI";
import ContentList from "../../components/ContentList";
class EssaysList extends React.Component {

    render () {

        return (
            <ContentList ContentAPI={EssaysAPI} contentType={'Essays'} />
        );
    }
}

export default EssaysList;

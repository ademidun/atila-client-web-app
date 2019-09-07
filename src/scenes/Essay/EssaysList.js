import React from 'react';

import EssaysAPI from "../../services/EssaysAPI";
import ContentList from "../../components/ContentList";
class EssaysList extends React.Component {

    render () {

        return (
            <div className="container ">
                <ContentList ContentAPI={EssaysAPI} contentType={'Essays'} />
            </div>
        );
    }
}

export default EssaysList;

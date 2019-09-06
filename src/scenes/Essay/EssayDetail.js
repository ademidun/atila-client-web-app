import React from 'react';
import PropTypes from 'prop-types';

import {EssayPropType} from "../../models/Essay";
import ContentDetail from "../../components/ContentDetail";
import EssaysApi from "../../services/EssaysAPI";

function EssayDetail({ match }) {
    const {params: { username, slug, }} = match;

    return (
        <div className="container">
            <ContentDetail
                contentSlug={`${username}/${slug}`}
                ContentAPI={EssaysApi}/>
        </div>
    );
}

EssayDetail.propTypes = {
    className: PropTypes.string,
    blog: EssayPropType
};

export default EssayDetail;

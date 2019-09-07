import React from 'react';
import PropTypes from 'prop-types';

import {EssayPropType} from "../../models/Essay";
import ContentDetail from "../../components/ContentDetail/ContentDetail";
import EssaysApi from "../../services/EssaysAPI";

function EssayDetail({ match }) {
    const {params: { username, slug, }} = match;

    return (
        <React.Fragment>
            <ContentDetail
                contentSlug={`${username}/${slug}`}
                ContentAPI={EssaysApi}
                contentType='essay'/>
        </React.Fragment>
    );
}

EssayDetail.defaultProps = {
    className: ''
};

EssayDetail.propTypes = {
    className: PropTypes.string,
    blog: EssayPropType
};

export default EssayDetail;

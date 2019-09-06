import React from 'react';
import PropTypes from 'prop-types';

import {BlogPropType} from "../../models/Blog";
import ContentDetail from "../../components/ContentDetail";
import BlogsApi from "../../services/BlogsAPI";

function BlogDetail({ match }) {
    const {params: { username, slug, }} = match;

    return (
        <div className="container">
            <ContentDetail
                contentSlug={`${username}/${slug}`}
                ContentAPI={BlogsApi}/>
        </div>
    );
}

BlogDetail.propTypes = {
    className: PropTypes.string,
    blog: BlogPropType
};

export default BlogDetail;

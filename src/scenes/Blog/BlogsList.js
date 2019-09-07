import React from 'react';

import BlogsAPI from "../../services/BlogsAPI";
import ContentList from "../../components/ContentList";
class BlogsList extends React.Component {

    render () {

        return (
            <ContentList ContentAPI={BlogsAPI} contentType={'Blogs'} />
        );
    }
}

export default BlogsList;

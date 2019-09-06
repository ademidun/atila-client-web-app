import React from 'react';

import BlogsAPI from "../../services/BlogsAPI";
import ContentList from "../../components/ContentList";
class BlogsList extends React.Component {

    render () {

        return (
            <div className="container ">
                <ContentList ContentAPI={BlogsAPI} contentType={'Blogs'} />
            </div>
        );
    }
}

export default BlogsList;

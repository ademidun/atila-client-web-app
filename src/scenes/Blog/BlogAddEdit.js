import React from 'react';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";
import BlogsApi from "../../services/BlogsAPI";

class BlogAddEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            blog: null,
            errorGettingBlog: null,
            isLoadingBlog: false,
        }
    }

    render () {
        return (
            <div className="text-center container">
                <ContentAddEdit contentType="Blog" ContentAPI={BlogsApi} />
            </div>
        );
    }
}

export default BlogAddEdit;

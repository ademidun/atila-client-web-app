import React from 'react';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";
import BlogsApi from "../../services/BlogsAPI";

function BlogAddEdit(props){

    const { match } = props;
    console.log({match});
    return (
        <div className="text-center container">
            <ContentAddEdit contentType="Blog" ContentAPI={BlogsApi} />
        </div>
    );
}

export default BlogAddEdit;

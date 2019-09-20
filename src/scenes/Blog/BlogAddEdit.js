import React from 'react';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";
import BlogsApi from "../../services/BlogsAPI";

function BlogAddEdit(){

    return (
        <div className="text-center container">
            <ContentAddEdit contentType="Blog" ContentAPI={BlogsApi} />
        </div>
    );
}

export default BlogAddEdit;

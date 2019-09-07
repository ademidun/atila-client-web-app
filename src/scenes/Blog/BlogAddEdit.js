import React from 'react';

class BlogAddEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: null,
            blogs: [],
            searchPayload: {
                location: { city :'', province :'', country :'', name :''},
                education_level :[],
                education_field :[],
                searchString: '' ,
                previewMode: 'universalSearch' ,
                filter_by_user_show_eligible_only: true,
                sort_by: 'relevance'
            },
            errorGettingBlogs: null,
            isLoadingBLogs: false,
            pageNumber: 1,
        }
    }

    render () {
        return (
            <div className="text-center container">
                <h1>Blog Add Edit</h1>
            </div>
        );
    }
}

export default BlogAddEdit;

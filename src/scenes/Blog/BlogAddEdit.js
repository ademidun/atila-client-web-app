import React from 'react';

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
                <h1>Blog Add Edit</h1>
            </div>
        );
    }
}

export default BlogAddEdit;

import React from 'react';
import PropTypes from 'prop-types';

import {BlogPropType} from "../../models/Blog";
import ContentDetail from "../../components/ContentDetail";
import BlogsApi from "../../services/BlogsAPI";
import Loading from "../../components/Loading";

class BlogDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            blog: null,
            errorGettingBlogs: null,
            isLoadingBLog: false,
        }
    }

    componentDidMount() {

        const {match: {params: {username, slug, }}} = this.props;
        this.setState({isLoadingBlog: true});
        BlogsApi.getSlug(`${username}/${slug}`)
            .then(res => {
                this.setState({blog: res.data.blog});

            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoadingBlog: false});
            });
    }
    render () {

        const { isLoadingBlog, blog } = this.state;

        if (isLoadingBlog) {
            return (<Loading
                isLoading={isLoadingBlog}
                title={'Loading Blog...'} />)
        }

        if (!blog) {
            return null;
        }

        return (
            <div className="container">
                <ContentDetail content={blog} />
            </div>
        );
    }
}

BlogDetail.propTypes = {
    className: PropTypes.string,
    blog: BlogPropType
};

export default BlogDetail;

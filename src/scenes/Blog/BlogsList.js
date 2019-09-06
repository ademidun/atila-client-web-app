import React from 'react';

import { genericItemTransform } from "../../services/utils";
import BlogsAPI from "../../services/BlogsAPI";
import Loading from "../../components/Loading";
import ContentCard from "../../components/ContentCard";
class BlogsList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: null,
            blogs: [],
            errorGettingBlogs: null,
            isLoadingBLogs: false,
            pageNumber: 1,
        }
    }

    loadMoreItems = () => {
        const { pageNumber } = this.state;

        this.setState({ pageNumber: pageNumber + 1 }, () => {
            this.loadItems(this.state.pageNumber);
        })
    };

    loadItems = (page) => {

        const { blogs, totalBlogsCount } = this.state;

        if (totalBlogsCount && blogs.length >= totalBlogsCount) {
            return
        }

        this.setState({ isLoadingBlogs: true });

        BlogsAPI.list(page)
            .then(res => {

                const blogResults = blogs;
                blogResults.push(...res.data.results);

                if (blogResults) {
                    this.setState({ blogs: blogResults });
                }

            })
            .catch(err => {
                console.log({ err});
                this.setState({errorGettingBlogs : err });
            })
            .finally(() => {
                this.setState({ isLoadingBlogs: false });
            });
    };

    componentDidMount() {
        this.loadItems();
    }

    render () {

        const { blogs, isLoadingBlogs,
            totalBlogsCount,
            errorGettingBlogs} = this.state;


        if (errorGettingBlogs) {
            return (
                <div className="text-center container">
                    <h1>
                        Error Getting Blogs
                        <span role="img" aria-label="sad face emoji">😕</span>
                    </h1>
                    <h3>Please try again later </h3>
                </div>)
        }

        if (blogs.length === 0) {
            return (
                <Loading
                    isLoading={isLoadingBlogs}
                    title={'Loading Blogs..'} />);
        }

        return (
            <div className="container ">

                <h1 className="text-center">
                    Blogs
                </h1>

                <div className="mt-3">
                    {blogs.map( blog => <ContentCard key={blog.id} content={genericItemTransform(blog)} className="col-12 mb-3"/>)}
                </div>
                {
                    blogs.length < totalBlogsCount
                    &&
                    <button className="btn btn-primary center-block font-size-xl" onClick={this.loadMoreItems}>
                        Load More
                    </button>
                }
            </div>
        );
    }
}

export default BlogsList;

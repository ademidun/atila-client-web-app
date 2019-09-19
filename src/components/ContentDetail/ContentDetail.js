import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import './ContentDetail.scss';
import Loading from "../Loading";
import RelatedItems from "../RelatedItems";
import {connect} from "react-redux";

class ContentDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: null,
            errorGettingContent: null,
            prevSlug: null,

        }
    }
    static getDerivedStateFromProps(props, state) {
        // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
        const { contentSlug } = props;
        const { prevSlug } = state;
        if (contentSlug !== prevSlug) {
            return {
                ...state,
                prevSlug: contentSlug,
                errorGettingContent: null,
                content: null
            };
        }

        // No state update necessary
        return null;
    }

    componentDidMount() {
        this.loadContent();
    }
    componentDidUpdate(prevProps, prevState) {
        const { content, errorGettingContent } = this.state;
        if (content === null && !errorGettingContent) {
            this.loadContent();
        }
    }

    loadContent = () => {
        const { ContentAPI, contentSlug } = this.props;

        ContentAPI.getSlug(contentSlug)
            .then(res => {

                if (res.data.blog) {
                    this.setState({content: res.data.blog});
                }
                else if( res.data.essay) {
                    this.setState({content: res.data.essay});
                }

            })
            .catch(err => {
                this.setState({errorGettingContent: { err }});
            })
            .finally(() => {
            });
    };
    
    render () {

        const { className, contentType, userProfile, contentSlug } = this.props;
        const { errorGettingContent, content } = this.state;

        if (errorGettingContent) {
            return (<div className="text-center">
                <h1>Error Getting {contentType}.</h1>
                <h3>
                    Please try again later
                </h3>
            </div>);
        }

        if (!content) {
            return (<Loading
                title={'Loading...'} />)
        }

        const canEditContent = userProfile && (userProfile.user === content.user.id || userProfile.is_atila_admin);

        const { title, body, header_image_url, user, id } = content;
        return (
            <div className="m-5 px-md-5">
                <div className={`${className} serif-font center-block`}>
                    <h1>{title}</h1>
                    {canEditContent &&
                    <Link to={`/${contentType.toLowerCase()}/edit/${contentSlug}`} >
                        Edit {contentType}
                    </Link>
                    }
                    {header_image_url &&
                    <img src={header_image_url}
                         alt={title}
                         style={{ maxWidth: '100%' }}
                         className="header-image"
                    />}

                    {user &&
                    <div className="bg-light my-3 p-1">
                        <Link to={`/profile/${user.username}`} >
                            <img
                                alt="user profile"
                                style={{ height: '50px', maxWidth: 'auto' }}
                                className="rounded-circle py-1 pr-1"
                                src={user.profile_pic_url} />
                            {user.first_name} {user.last_name}
                        </Link>
                    </div>}
                </div>
                    {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                    <div className="row">
                        <div className={`${className} col-md-8 serif-font content-detail`} dangerouslySetInnerHTML={{__html: body}} />
                        <RelatedItems
                            className="col-md-4"
                            id={id}
                            itemType={contentType} />
                    </div>

            </div>
        );
    }
}
ContentDetail.defaultProps = {
    className: ''
};

ContentDetail.propTypes = {
    className: PropTypes.string,
    contentType: PropTypes.string.isRequired,
    ContentAPI: PropTypes.func.isRequired,
    contentSlug: PropTypes.string.isRequired,
    //redux
    userProfile: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ContentDetail);
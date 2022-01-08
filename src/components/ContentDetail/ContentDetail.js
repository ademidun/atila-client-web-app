import React from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter,} from "react-router-dom";

import './ContentDetail.scss';
import Loading from "../Loading";
import RelatedItems from "../RelatedItems";
import {connect} from "react-redux";
import AnalyticsService from "../../services/AnalyticsService";
import HelmetSeo from "../HelmetSeo";
import {
    createTableOfContents,
    addStyleClasstoTables,
    genericItemTransform,
    guestPageViewsIncrement,
    scrollToElement,
    toTitleCase,
    openAllLinksInNewTab
} from "../../services/utils";
import { Button } from "antd";
import AtilaPointsPaywallModal from "../AtilaPointsPaywallModal";
import {UserProfilePreview} from "../ReferredByInput";
import ContentPaymentForm from '../Payments/ContentPaymentForm';

class ContentDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: null,
            errorGettingContent: null,
            prevSlug: null,
            pageViews: null,

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
                content: null,
                pageViews: null,
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
        const { ContentAPI, contentSlug, userProfile, location } = this.props;

        ContentAPI.getSlug(contentSlug)
            .then(res => {

                const content = res.data.blog || res.data.essay;
                this.setState({content}, () => {

                    addStyleClasstoTables(".content-detail");
                    createTableOfContents(".content-detail");
                    openAllLinksInNewTab(".content-detail");
                    if (location && location.hash) {
                        scrollToElement(location.hash);
                    }
                });

                AnalyticsService
                    .savePageView(content, userProfile)
                    .then(() => {
                        if(!userProfile) {
                            const guestPageViews = guestPageViewsIncrement();
                            this.setState({pageViews: {guestPageViews}});
                        }
                    })
                    .catch(err => {
                        console.log({err});
                    })
            })
            .catch(err => {
                this.setState({errorGettingContent: { err }});
            })
            .finally(() => {
            });
    };
    
    render () {

        const { className, contentType, userProfile, contentSlug } = this.props;
        const { errorGettingContent, content, pageViews } = this.state;

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

        const { title, body, header_image_url, user, id, published, contributors } = content;

        let isContributor = false;
        if (userProfile && contributors) {
            for (const contribUser of contributors) {
                if (userProfile.user === contribUser.user) {
                    isContributor = true;
                    break;
                }
            }
        }

        const canEditContent = userProfile && (userProfile.user === content.user.id ||
            userProfile.is_atila_admin || isContributor);

        let contentToDisplay = null;

        if(!userProfile && contentType === 'essay') {
            contentToDisplay = (
                <div className=" col-md-8 content-detail">
                    <div className={`${className} paywall-border`}
                         dangerouslySetInnerHTML={{__html: body}} />
                    <div className="card shadow p-3">
                        <p>
                            Register to Read Full {toTitleCase(contentType)}
                        </p>
                        <Button type="primary">
                            <Link to="/register">
                                Register
                            </Link>
                        </Button>
                    </div>
                </div>
            );

        } else {
            contentToDisplay = (
                <div className={`${className} col-md-8`}>
                    <ContentPaymentForm contentId={id} contentType={contentType} />
                    <hr/>
                    <div className="content-detail"
                        dangerouslySetInnerHTML={{__html: body}} />
                        <hr />
                    <ContentPaymentForm contentId={id} contentType={contentType} />
                </div>
            )
        }

        let authors = [user]
        if (contributors) {
         authors.push(...contributors)
        }

        let authorsReact = authors.map(userProfile => 
            <div key={userProfile.username} className="bg-light my-3" style={{display: 'inline-block', padding: '10px'}}>
                <UserProfilePreview userProfile={userProfile} linkProfile={true} />
            </div>);

        return (
            <div className="m-5 px-md-5">
                <HelmetSeo content={genericItemTransform(content)} />
                <div className={`${className} center-block`}>
                    <h1>{title}</h1>
                    {header_image_url &&
                    <div className="col-12 text-center">
                        <img src={header_image_url}
                            alt={title}
                            className="header-image"
                        />
                    </div>
                    }

                    {pageViews &&
                    <AtilaPointsPaywallModal pageViews={pageViews} />
                    }
                    {canEditContent &&
                    <div className="mt-3">
                        <Link to={`/${contentType.toLowerCase()}/edit/${contentSlug}`} >
                            Edit {contentType}
                        </Link>
                    </div>
                    }

                    {!published &&
                    <p  className="badge badge-secondary mx-1"
                        style={{ fontSize: 'small' }}>
                        Unpublished
                    </p>}

                    {user && authorsReact}

                </div>
                    {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                    <div className="row">

                        {contentToDisplay}
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
    className: '',
    userProfile: null,
};

ContentDetail.propTypes = {
    className: PropTypes.string,
    contentType: PropTypes.string.isRequired,
    ContentAPI: PropTypes.func.isRequired,
    contentSlug: PropTypes.string.isRequired,
    //redux
    userProfile: PropTypes.shape({})
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(ContentDetail));

export const  ContentDetailTest = ContentDetail;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert } from 'antd';
import Loading from '../Loading';
import RelatedItems from '../RelatedItems';
import { getErrorMessage } from '../../services/utils';
import HelmetSeo from '../HelmetSeo';
import { UserProfilePreview } from '../ReferredByInput';
import ContentBody from './ContentBody/ContentBody';
import EmbedResponsiveYoutubeVideo from '../../scenes/LandingPage/LandingPageLiveDemo';

function ContentDetail({ contentType, ContentAPI, userProfile }) {
    const { slug } = useParams();
    const [content, setContent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, [slug]);

    const loadContent = async () => {
        try {
            const response = await ContentAPI.getSlug(slug);
            const content = response.data.blog || response.data.essay;
            setContent(content);
        } catch (error) {
            console.error('Error loading content:', error);
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading title="Loading..." />;
    }

    if (error) {
        return (
            <div className="text-center">
                <h1>Error Getting {contentType}</h1>
                <h3>Please try again later</h3>
                <Alert type="error" message={error} />
            </div>
        );
    }

    if (!content) {
        return (
            <div className="text-center">
                <h1>{contentType} Not Found</h1>
                <h3>The requested {contentType.toLowerCase()} could not be found.</h3>
            </div>
        );
    }

    const { title, body, header_image_url, video_url, slides_url, body_type, user, id, published, contributors } = content;

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

    let authors = [user];
    if (contributors) {
        authors.push(...contributors);
    }

    const authorsReact = authors.map(userProfile => (
        <div key={userProfile.username} className="bg-light my-3" style={{ display: 'inline-block', padding: '10px' }}>
            <UserProfilePreview userProfile={userProfile} linkProfile={true} />
        </div>
    ));

    return (
        <div className="m-md-5 m-4">
            <HelmetSeo content={content} />
            <div className="center-block">
                <h1>{title}</h1>
                {header_image_url && (
                    <div className="col-12 text-center">
                        <img src={header_image_url} alt={title} className="header-image" />
                    </div>
                )}

                {canEditContent && (
                    <div className="mt-3">
                        <Link to={`/${contentType.toLowerCase()}/edit/${slug}`}>
                            Edit {contentType}
                        </Link>
                    </div>
                )}

                {!published && (
                    <p className="badge badge-secondary mx-1" style={{ fontSize: 'small' }}>
                        Unpublished
                    </p>
                )}

                {user && authorsReact}
            </div>

            <div className="row">
                <div className="col-md-8">
                    {video_url && <EmbedResponsiveYoutubeVideo youtubeVideoUrl={video_url} title={title} />}
                    {slides_url && slides_url.startsWith("https://docs.google.com") && (
                        <div className="responsive-google-slides">
                            <iframe title={title} src={slides_url}></iframe>
                        </div>
                    )}
                    <ContentBody body={body} bodyType={body_type} />
                </div>
                {contentType !== 'essay' && (
                    <RelatedItems
                        className="col-md-4"
                        id={id}
                        itemType={contentType}
                    />
                )}
            </div>
        </div>
    );
}

ContentDetail.propTypes = {
    contentType: PropTypes.string.isRequired,
    ContentAPI: PropTypes.object.isRequired,
    userProfile: PropTypes.object
};

const mapStateToProps = state => ({
    userProfile: state.data.user.loggedInUserProfile
});

export default connect(mapStateToProps)(ContentDetail);

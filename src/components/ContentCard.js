import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import './Footer/Footer.scss';
import { ProfilePicPreview, UserProfilePreview } from "./ReferredByInput";
import './ContentCard.scss'
import { Button } from "antd";
import aa from "search-insights";
import Environment from "../services/Environment";
import { getAlogliaIndexName } from "../services/utils";

aa('init', {
  appId: Environment.ALGOLIA_APP_ID,
  apiKey: Environment.ALGOLIA_PUBLIC_KEY,
  useCookie: true,
})

class ContentCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPreview: false,
            insights: props.insights,
            contentType: props.content.type,
            id: props.content.id
        }
    }

    togglePreview = (event) => {
        event.preventDefault();

        const { showPreview } = this.state;
        this.setState({ showPreview: !showPreview });

    };

    buildAlgoliaAnalyticsEvent = () => {
        const userId = localStorage.getItem('userId');
        let insightEvent = {
            eventName: `${this.state.contentType}_clicked`
        }

        if (userId !== null) {
            insightEvent = {...insightEvent, userToken: userId}
        }

        return insightEvent;
    }

    sendAlgoliaAnalyticsEvent = () => {
        let insightEvent = this.buildAlgoliaAnalyticsEvent();

        console.log('sending event to algolia');
        if (this.state.insights !== undefined) {
            // sending algolia analytics event under the search context
            this.state.insights('clickedObjectIDsAfterSearch', insightEvent)
        } else {
            // sending click events (from recommended)
            insightEvent = {
                ...insightEvent,
                index: getAlogliaIndexName(this.state.contentType),
                objectIDs: [this.state.id.toString()]
            }
            aa('clickedObjectIDs', insightEvent);
        }
        console.log('event sent');
    }

    render() {

        const { content, hideImage } = this.props;
        const { showPreview } = this.state;
        const { title, description, image, slug, type} = content;
        let { contributors, contributors_json, user, user_json } = content;

        contributors = contributors || contributors_json;
        user = user || user_json;

        let descriptionText = description;

        const PREVIEW_MINIMUM = 75;
        const PREVIEW_MAXIMUM = 240;
        const showPreviewButton = description?.length > PREVIEW_MINIMUM;

        if (description) {
            descriptionText = showPreview ? description.substring(0, PREVIEW_MAXIMUM) : `${description.substring(0, PREVIEW_MINIMUM)}`;
            if (description.length > descriptionText.length) {
                descriptionText += '...'
            }
        }

        let authorsComponent = null;

        if (user) {
            authorsComponent = (
                <div className="bg-light my-3">
                    <UserProfilePreview userProfile={user} linkProfile={true} />
                    {contributors && contributors.map(userProfile =>
                        <ProfilePicPreview userProfile={userProfile} key={userProfile.username} linkProfile={true} />)}
                </div>
            )
        }

        return (
            <div className='ContentCard shadow mb-3'>
                    {!hideImage && image && 
                    <div className='upper-container'>
                        <Link title={title} to={slug}>
                            {type === "blog" &&
                            <div className='upper-container-2'>
                                <img src={image}
                                    alt={title}
                                />
                            </div>
                            }
                            {type !== "blog" &&
                            <div className='image-container'>
                                <img id="avatar-pic" src={image}
                                    alt={title}
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </div>
                            }
                        </Link>
                    </div>
                    }
                    <div className='lower-container'>
                        <div className="title">
                            <Link title={title} to={slug} onClick={this.sendAlgoliaAnalyticsEvent}>
                                <h3> {title} </h3>
                            </Link>
                        </div>
                        {authorsComponent}
                        <p className="body"> 
                            {descriptionText}
                        </p>
                            
                        {showPreviewButton && 
                        <Button onClick={this.togglePreview}>{showPreview ? "Show Less" : "Show More"}</Button>
                        }
                        
                    </div>
            </div>
        )
    }
}

ContentCard.defaultProps = {
    className: '',
    customStyle: {},
    hideImage: false
};

ContentCard.propTypes = {
    hideImage: PropTypes.bool,
    className: PropTypes.string,
    content: PropTypes.shape({}),
    customStyle: PropTypes.shape({})
};

export default ContentCard;
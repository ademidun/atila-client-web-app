import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import './Footer/Footer.scss';
import { ProfilePicPreview, UserProfilePreview } from "./ReferredByInput";
import './ContentCard.scss'
import { Button } from "antd";


class ContentCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPreview: false,
        }
    }

    togglePreview = (event) => {
        event.preventDefault();

        const { showPreview } = this.state;
        this.setState({ showPreview: !showPreview });

    };



    render() {

        const { content, hideImage } = this.props;
        const { showPreview } = this.state;
        const { title, description, image, slug, type, user, contributors } = content;

        let descriptionText = description;

        if (description) {
            descriptionText = showPreview ? description.substring(0, 240) : `${description.substring(0, 100)}`;
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
                    </div>
                    }
                    <div className='lower-container'>
                        <Link title={title} to={slug}>
                            <h3> {title} </h3>
                        </Link>
                        {authorsComponent}
                        <p> {descriptionText} </p>
                        <Link to={slug}>
                            <Button> Read More</Button>
                        </Link>
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
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import './Footer/Footer.scss';
import {truncate} from "../services/utils";
import {ProfilePicPreview, UserProfilePreview} from "./ReferredByInput";

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

        const { className, content, hideImage, customStyle } = this.props;
        const { showPreview } = this.state;
        const { title, description, image, slug, type, user, published, contributors } = content;

        let descriptionText = description;

        if (description && !hideImage) {
            descriptionText = showPreview ? description.substring(0,240) : `${description.substring(0,100)}`;
            if (description.length > descriptionText) {
                descriptionText +='...'
            }
        }

        let authorsReact = (
            <div className="bg-light my-3">
                <UserProfilePreview userProfile={user} linkProfile={true} />
                {contributors && contributors.map(userProfile => <ProfilePicPreview userProfile={userProfile} />)}
            </div>
        )


        return (
            <div className={`${className} card shadow p-3`} style={customStyle}>
                <div  className="card-title">
                    <h3>
                        <Link  title={title} to={slug}>
                            {truncate(title)}
                        </Link>
                    </h3>
                    <br />
                    <p  className="badge badge-secondary"
                        style={{ fontSize: 'small' }}>
                        {type}
                    </p>
                    {published===false &&
                    <p  className="badge badge-secondary mx-1"
                        style={{ fontSize: 'small' }}>
                        Unpublished
                    </p>}
                </div>
                {user && authorsReact}
                <div  className="card-image mb-3">
                    {
                    !hideImage && image &&
                    <Link to={slug}>
                        <img  src={image}
                              alt={title}
                              style={{ width: '100%'}}
                        />
                    </Link>
                    }
                </div>
                <div className="card-text">
                    { descriptionText }
                </div>
                {!hideImage &&
                    <button className="btn btn-link" onClick={this.togglePreview}>
                        Preview
                    </button>
                }
            </div>
        );
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
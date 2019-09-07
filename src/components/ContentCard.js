import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import './Footer.scss';

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

        const { className, content, hideImage } = this.props;
        const { showPreview } = this.state;
        const { title, description, image, slug, type, user } = content;

        let descriptionText = description;

        if (description && !hideImage) {
            descriptionText = showPreview ? description : `${description.substring(0,100)}`;
            if (!showPreview && description.length > 100) {
                descriptionText +='...'
            }
        }
        return (
            <div className={`${className} card shadow p-3`}>
                <div  className="card-title">
                    <h3>
                        <Link  title="How to Get a Summer Internship" to={slug}>
                            {title}
                        </Link>
                    </h3>
                    <br />
                    <p  className="badge badge-secondary"
                        style={{ fontSize: 'small' }}>
                        {type}
                    </p>
                </div>
                {user && <div className="bg-light mb-3 p-1">
                    <Link to={`/profile/${user.username}`} >
                        <img
                            alt="user profile"
                            style={{ height: '50px', maxWidth: 'auto' }}
                            className="rounded-circle py-1 pr-1"
                            src={user.profile_pic_url} />
                        {user.first_name} {user.last_name}
                    </Link>
                </div>}
                <div  className="card-image ng-star-inserted mb-3">
                    {
                    !hideImage &&
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
    hideImage: false
};

ContentCard.propTypes = {
    hideImage: PropTypes.bool,
    className: PropTypes.string,
    content: PropTypes.shape({})
};

export default ContentCard;
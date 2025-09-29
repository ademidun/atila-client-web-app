import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

interface ContentProps {
    content: {
        title: string;
        description: string;
        image?: string;
        slug?: string;
        url?: string;
        type?: string;
    };
    hideImage?: boolean;
    className?: string;
}

class ContentCard extends React.Component<ContentProps> {
    static defaultProps = {
        hideImage: false
    };

    static propTypes = {
        hideImage: PropTypes.bool,
        content: PropTypes.object.isRequired
    };

    state = {
        showPreview: false
    };

    togglePreview = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.setState({ showPreview: !this.state.showPreview });
    };

    render(): React.ReactNode {
        const { content, hideImage } = this.props;
        const { showPreview } = this.state;
        if (!content) return null; // Ensure valid content

        return (
            <div className={`ContentCard shadow mb-3 ${this.props.className ? this.props.className : ''}`}>
                {!hideImage && content.image && 
                <div className='upper-container'>
                    <Link to={content.slug ?? "#"}>
                        <img src={content.image} alt={content.title} />
                    </Link>
                </div>
                }
                <div className='lower-container'>
                    <h3>{content.title}</h3>
                    <p>{showPreview ? content.description : content.description?.slice(0, 100) + "..."}</p>
                    <button onClick={this.togglePreview}>
                        {showPreview ? "Show Less" : "Show More"}
                    </button>
                </div>
            </div>
        );
    }
}

interface StateProps {
    loggedInUserProfile: {
        id: string;
        name: string;
        email: string;
        // Add other properties as needed
    };
}

const mapStateToProps = (state: any): StateProps => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ContentCard);

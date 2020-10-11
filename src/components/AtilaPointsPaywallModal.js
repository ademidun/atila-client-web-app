import React from "react";
import PropTypes from "prop-types";
import {Button, Modal, Popover} from 'antd';
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import { faQuestionCircle} from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



export const ATILA_POINTS_EXPLAIN_POPOVER = (
    <span>
                <p>
                Get points for adding content
                    like scholarships, blog posts and essays.
                You can use those points for special features like viewing essays,
                    scholarships, easier applications and more.
                </p>
                <Link to="/blog/atila/what-is-atila#atila-points"> Learn More </Link>
            </span>
);

class AtilaPointsPaywallModal extends React.Component {
    constructor(props) {
        super(props);

        const { pageViews } = props;
        this.state = {
            visible: false,
            pageViews,
            viewCount: null,
            viewCountType: null,
        }
    }

    componentDidMount() {
        this.showModalUsingPageViews();
    }

    showModalUsingPageViews = () => {
        const { pageViews, location : { pathname }, userProfile } = this.props;

        if (pathname === '/blog/atila/what-is-atila') {
            return
        }

        if (!userProfile) {
            this.setState({viewCount: pageViews.guestPageViews, visible: pageViews.guestPageViews % 5 === 0});
        }
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {

        const { userProfile } = this.props;
        const { viewCount } = this.state;

        if (userProfile) {
            return null
        }
        const guestOrUserProfileContent = (
                        <span>
                            <h3>
                                You have viewed {viewCount} pages
                            </h3>
                            <br/>
                            <h5>
                                You have not{' '}
                                <Link to="/register">
                                    created an account
                                </Link>
                            </h5>
                        </span>);

        const registerCTA = (<Link to="/register">Register for free</Link>);
        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    maskStyle={{background: 'rgba(0,0,0,0.93)'}}
                    closable={false}
                    footer={[
                        <Button key="back"
                                onClick={this.handleCancel}>
                            Close
                        </Button>,
                        <Button key="submit"
                                type="primary"
                                onClick={this.handleOk}>
                            {registerCTA}
                        </Button>,
                    ]}
                >
                    <div className="p-3">
                        {guestOrUserProfileContent}
                        <br/>
                        <h4><Link to="/register">Register for free</Link> to keep viewing</h4>
                    </div>

                </Modal>
            </div>
        );
    }
}

AtilaPointsPaywallModal.defaultProps = {
    userProfile: null
};

AtilaPointsPaywallModal.propTypes = {
    pageViews: PropTypes.shape({}).isRequired,
    userProfile: PropTypes.shape({}),
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(AtilaPointsPaywallModal));
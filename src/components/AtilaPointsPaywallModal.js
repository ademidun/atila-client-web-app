import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from 'antd';
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";

function AtilaPointsPaywallModal({ pageViews, userProfile }) {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const [viewCount, setViewCount] = useState(null);

    const showModalUsingPageViews = useCallback(() => {
        if (location.pathname === '/blog/atila/what-is-atila') {
            return;
        }

        if (!userProfile) {
            setViewCount(pageViews.guestPageViews);
            setVisible(pageViews.guestPageViews % 5 === 0);
        }
    }, [location.pathname, userProfile, pageViews.guestPageViews]);

    useEffect(() => {
        showModalUsingPageViews();
    }, [showModalUsingPageViews]);

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    if (userProfile) {
        return null;
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
        </span>
    );

    const registerCTA = (<Link to="/register">Register for free</Link>);

    return (
        <div>
            <Modal
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
                maskStyle={{background: 'rgba(0,0,0,0.93)'}}
                closable={false}
                footer={[
                    <Button key="back"
                            onClick={handleCancel}>
                        Close
                    </Button>,
                    <Button key="submit"
                            type="primary"
                            onClick={handleOk}>
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

export default connect(mapStateToProps)(AtilaPointsPaywallModal);
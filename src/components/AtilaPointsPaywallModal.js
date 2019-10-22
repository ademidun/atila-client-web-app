import React from "react";
import PropTypes from "prop-types";
import {Button, Modal, Popover} from 'antd';
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import { faQuestionCircle} from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class AtilaPointsPaywallModal extends React.Component {
    constructor(props) {
        super(props);

        const { pageViews } = props;
        this.state = {
            visible: false,
            pageViews,
        }
    }

    componentDidMount() {
        this.showModalUsingPageViews();
    }

    showModalUsingPageViews = () => {
        const { pageViews, location : { pathname } } = this.props;

        if (pathname === '/blog/atila/what-is-atila') {
            return
        }
        if (pageViews.count % 5 === 0) {
            this.setState({visible: true});
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

        const { pageViews, userProfile } = this.props;

        const atilaPointsPopover = (
            <span>
                <p>
                Points system where  you get points for adding content
                    like scholarships, blog posts and essays.
                You can use those points for special features like viewing essays,
                    scholarships, easier applications and more.
                You can also get paid for the content you contribute.
                </p>
                <Link to="/blog/atila/what-is-atila"> Learn More </Link>
            </span>
        );

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
                            <Link to="/register">Get Atila Plus</Link>
                        </Button>,
                    ]}
                >
                    <div className="p-3">
                        <h3>You have viewed {pageViews.count} pages</h3>
                        <h5>And Only have{' '}
                            {parseInt(userProfile.atila_points).toLocaleString()}
                            {' '}
                            <Popover content={atilaPointsPopover}
                                     title="What is Atila Points?">
                                <Link to="/blog/atila/what-is-atila#atila-points">
                                    Atila Points <FontAwesomeIcon icon={faQuestionCircle} />
                                </Link>
                            </Popover>

                        </h5>

                        <br/>
                        <h4>Ways to keep Viewing: </h4>
                        <ol className="font-size-xl">
                            <li className="font-weight-bold">
                                <Link to="/register">Get Atila Plus</Link>
                            </li>
                            <li>
                                <Link to="/scholarship/add">Add a scholarship</Link>
                            </li>
                            <li>
                                <Link to="/blog/add">Add a blog post</Link>
                            </li>
                            <li>
                                <Link to="/essay/add">Add an Essay</Link>
                            </li>
                        </ol>
                    </div>

                </Modal>
            </div>
        );
    }
}

AtilaPointsPaywallModal.propTypes = {
    pageViews: PropTypes.shape({}).isRequired,
    userProfile: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(AtilaPointsPaywallModal));
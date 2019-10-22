import React from "react";
import PropTypes from "prop-types";
import {Button, Modal} from 'antd';
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";

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
        this.showModalUsingpageViews();
    }

    showModalUsingpageViews = () => {
        const { pageViews } = this.props;
        if (pageViews.count > 5) {
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

        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    maskStyle={{background: 'rgba(0,0,0,0.87)'}}
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
                        <h5>And Only have
                            {parseInt(userProfile.atila_points).toLocaleString()}
                            {' '}Atila Points
                        </h5> <br/>
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
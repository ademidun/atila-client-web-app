import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Button, Col, Row, Timeline, Modal, Alert} from "antd";
import BillingAPI from "../../services/BillingAPI";
import Loading from "../../components/Loading";
import moment from "moment";
import {Link} from "react-router-dom";
import {transformErrorMessage} from "../../services/utils";
import UserProfileAPI from "../../services/UserProfileAPI";
import {updateLoggedInUserProfile} from "../../redux/actions/user";


class UserProfileSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            customerData: null,
            customerDataIsLoading: null,
            isResponseErrorMessage: null,
            isResponseSuccessMessage: null,
            cancelSubscriptionLoadingText: null,
        }
    }

    componentDidMount() {
        this.getCustomer();
    }

    getCustomer = () => {
        const { userProfile } = this.props;

        this.setState({customerDataIsLoading: true});

        BillingAPI.getCustomer(userProfile.stripe_customer_id)
            .then(res => {
                this.setState({customerData: res.data.data});
            })
            .catch()
            .finally(()=> {
                this.setState({customerDataIsLoading: false});
            })
    };

    showConfirm = () => {
        Modal.confirm({
            title: 'Are you sure you want to cancel your subscription? 😢',
            content: <p>
                You will not be charged again for this subscription. <br/>
                Your subscription will terminate at the end of the current billing period.
            </p>,
            onOk: this.cancelSubscription,
            onCancel: () => {},
        });
    };

    cancelSubscription = () => {
        const {id, subscriptionData : { subscriptionId }} = this.state.customerData;
        const { userProfile: user, updateLoggedInUserProfile } = this.props;

        this.setState({cancelSubscriptionLoadingText: 'Cancelling Subscription...'});
        BillingAPI.cancelSubscription(id, subscriptionId)
            .then(res=> {
                console.log({res});
                UserProfileAPI
                    .patch({is_atila_premium: false }, user)
                    .then(res => {
                        updateLoggedInUserProfile(res.data);
                        this.setState({isResponseSuccessMessage:
                                'Your premium subscription has been cancelled.'});
                    })
                    .catch(err=> {
                        console.log({err});
                        this.setState({cancelSubscriptionLoadingText: null});
                        this.setState({isResponseErrorMessage: transformErrorMessage(err)});
                    })
            })
            .catch(err=> {
                console.log({err});
                this.setState({cancelSubscriptionLoadingText: null});
                this.setState({isResponseErrorMessage: transformErrorMessage(err)});
            })
    };

    render () {

        const { customerData, isResponseErrorMessage,
            isResponseSuccessMessage, customerDataIsLoading, cancelSubscriptionLoadingText } = this.state;
        const { userProfile } = this.props;

        if (customerDataIsLoading) {
            return <Loading title="Loading Billing Details..." />
        }

        if (!userProfile.is_atila_premium || !customerData) {
            return (
                <div>
                    <h1 className="my-3">Settings</h1>
                    <Row style={{textAlign: 'left'}}>
                        <Col sm={24} md={12}>
                            <span><strong> Account Type: </strong> Student {userProfile.is_atila_premium ? 'Premium' : 'Free'}</span>
                            {!userProfile.is_atila_premium &&
                            <Button style={{ marginTop: 16 }}
                                    className="m-3"
                                    type="primary">
                                <Link to="/premium">
                                    Go Premium
                                </Link>
                            </Button>
                            }
                        </Col>
                    </Row>
                </div>
            )
        }
        const isResponseErrorMessageWithContactLink = (<div>
            {isResponseErrorMessage}
            <br /> <Link to="/contact"> Contact us</Link> if problem continues
        </div>);

        const { subscriptionData: {current_period_start, current_period_end} } = customerData;

        let lastBillDate = new Date(1970, 0, 1).setSeconds(current_period_start);
        lastBillDate = moment(lastBillDate).format('dddd, MMMM DD, YYYY');
        let nextBillDate = new Date(1970, 0, 1).setSeconds(current_period_end);
        nextBillDate = moment(nextBillDate).format('dddd, MMMM DD, YYYY');
        return (
            <div>
                <h1 className="my-3">Settings</h1>
                <Row style={{textAlign: 'left'}}>
                    <Col sm={24} md={12}>
                        <Timeline>
                            <Timeline.Item color="green">Last Bill Date: {lastBillDate}</Timeline.Item>
                            <Timeline.Item>Next Bill Date: {nextBillDate}</Timeline.Item>
                        </Timeline>
                        <Button style={{ marginTop: 16 }}
                                onClick={this.showConfirm}
                                type="danger"
                                className="my-3">
                            Cancel Subscription
                        </Button>
                        <p>Questions about your subscription? <Link to="/contact">Contact us</Link> </p>
                        {isResponseErrorMessage &&
                        <Alert
                            type="error"
                            message={isResponseErrorMessageWithContactLink}
                        />
                        }
                        {isResponseSuccessMessage &&
                        <Alert
                            type="success"
                            message={isResponseSuccessMessage}
                        />
                        }
                        {
                            cancelSubscriptionLoadingText &&
                            <Loading title={cancelSubscriptionLoadingText} />
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapDispatchToProps = {
    updateLoggedInUserProfile
};
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

UserProfileSettings.defaultProps = {
    // redux
    userProfile: null,
};

UserProfileSettings.propTypes = {
    // redux
    userProfile: PropTypes.shape({}),
    updateLoggedInUserProfile: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileSettings);

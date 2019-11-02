import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Button, Col, Row, Statistic} from "antd";
import BillingAPI from "../../services/BillingAPI";
import Loading from "../../components/Loading";
import moment from "moment";


class UserProfileSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            customerData: null,
        }
    }

    componentDidMount() {
        this.getCustomer();
    }

    getCustomer = () => {
        const { userProfile } = this.props;

        BillingAPI.getCustomer(userProfile.stripe_customer_id)
            .then(res => {
                console.log({res});
                this.setState({customerData: res.data.data});
            })
    };;

    render () {

        const { customerData } = this.state;

        if (!customerData) {
            return <Loading title="Loading Payment Details..." />
        }

        const { subscriptionData: {current_period_start, current_period_end} } = customerData;

        let lastBillDate = new Date(1970, 0, 1).setSeconds(current_period_start);
        lastBillDate = moment(lastBillDate).format('dddd, MMMM DD, YYYY');
        let nextBillDate = new Date(1970, 0, 1).setSeconds(current_period_end);
        nextBillDate = moment(nextBillDate).format('dddd, MMMM DD, YYYY');
        return (
            <div>
                <h1>Settings</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        Last Bill Date: {lastBillDate}
                    </Col>
                    <Col span={12}>
                        Next Bill Date: {nextBillDate}
                        <Button style={{ marginTop: 16 }} type="danger">
                            Cancel Subscription
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

UserProfileSettings.defaultProps = {
    // redux
    userProfile: null,
};

UserProfileSettings.propTypes = {
    // redux
    userProfile: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps)(UserProfileSettings);

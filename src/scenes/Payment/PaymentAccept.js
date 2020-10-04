import React from 'react';
import {connect} from "react-redux";
import {Button, Col, Input, Row, Steps} from "antd";
import PaymentAPI from "../../services/PaymentAPI";
import Loading from "../../components/Loading";
import UserProfileAPI from "../../services/UserProfileAPI";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import {formatCurrency} from "../../services/utils";

const { Step } = Steps;

const ALL_PAYMENT_ACCEPTANCE_STEPS = ["link_bank_account", "request_payment"];

class PaymentAccept extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
            // Enum of type: "link_bank_account", "request_payment"
            currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[0],
            application: null,
            scholarship: null,
        }
    }

    componentDidMount() {

        const { userProfile } = this.props;
        this.getApplication();

        if (!userProfile.stripe_connected_account_id) {
            // User has not linked their bank account yet so they need to do that first.
            this.setState({currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[0]})
        } else {
            // User already has a Stripe Connected Account, so their bank account is already linked.
            // // Time to Request Payment
            // 1. Get Application Details and Scholarship Funding Amount
            // 2. Send a transfer request to move <scholarship.funding_amount from Atila's bank account to
            // the student's account

            this.setState({currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[1]})
        }
    }

    getApplication = () => {
        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);

        let applicationID = params.get('application');
        this.setState({isLoading: "Retrieving Application..."});
        ApplicationsAPI.get(applicationID)
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoading: null});
            })
    };

    linkBankAccount = (event=null) => {

        if(event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { userProfile } = this.props;

        const { first_name, last_name, email } = userProfile;

        this.setState({isLoading: "Connecting Bank Account"});

        const accountData = {
            user_profile: { first_name, last_name, email },
            return_url: window.location.href,
            refresh_url: window.location.href,
        };
        PaymentAPI
            .createAccount(accountData)
            .then(res => {

                const { data: { redirect_url, account_id } } = res;
                this.saveUserConnectedAccountId(account_id, redirect_url);
            })
            .catch(err => {
                console.log({err});
                this.setState({isLoading: null});
            })
            .finally(() => {
            });


    };

    saveUserConnectedAccountId = (account_id, redirect_url) => {
        const { userProfile, updateLoggedInUserProfile } = this.props;

        const {user} = userProfile;
        this.setState({isLoading: "Saving User Profile"});
        UserProfileAPI
            .patch({stripe_connected_account_id: account_id}, user)
            .then(res => {
                updateLoggedInUserProfile(res.data);
                window.location.href = redirect_url;
            })
            .catch(err => {
                console.log({err})
            })
            .finally(() => {
                this.setState({isLoading: null});
            });
    };

    acceptPayment = () => {

    };

    render () {

        const { userProfile } = this.props;
        const { isLoading, currentPaymentAcceptanceStep, application, scholarship } = this.state;

        if (!application) {
            return (
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        {isLoading &&
                        <Loading title={isLoading} />
                        }
                    </div>
                </div>
            )
        }
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    {isLoading &&
                    <Loading title={isLoading} />
                    }
                    <Steps type="navigation"
                        current={ALL_PAYMENT_ACCEPTANCE_STEPS
                            .findIndex(step => step === currentPaymentAcceptanceStep)}>
                        <Step title="Link Bank Account" />
                        <Step title="Accept Payment" />
                    </Steps>
                    <div>
                        <h1>Connect Your Bank Account</h1>
                        <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                            <Col span={24}>
                                <Input value={userProfile.first_name} disabled={true} />
                            </Col>
                            <Col span={24}>
                                <Input value={userProfile.last_name} disabled={true} />
                            </Col>
                            <Col span={24}>
                                <Input value={userProfile.email} disabled={true}/>
                            </Col>
                            <Col span={24}>
                                    <Button onClick={this.linkBankAccount}
                                            className="center-block mt-3"
                                            type="primary"
                                            disabled={isLoading || currentPaymentAcceptanceStep !== ALL_PAYMENT_ACCEPTANCE_STEPS[0]}>
                                        Link Bank Account with Stripe (Step 1)
                                    </Button>
                                    <Button onClick={this.acceptPayment}
                                            className="center-block mt-3"
                                            type="primary"
                                            disabled={isLoading || currentPaymentAcceptanceStep !== ALL_PAYMENT_ACCEPTANCE_STEPS[1]}>
                                        Accept Payment for {scholarship.name}
                                        (
                                        {formatCurrency(Number.parseInt(scholarship.funding_amount))}
                                        ){' '}(Step 2)
                                    </Button>

                                <p className="mt-3">
                                    You will be redirected to{' '}
                                    <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" >
                                        Stripe</a>{' '}
                                    to complete your payment setup.{' '}
                                    <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" >
                                        Click here to learn more about Stripe.
                                    </a>
                                </p>
                            </Col>

                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = {
    updateLoggedInUserProfile
};
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentAccept);

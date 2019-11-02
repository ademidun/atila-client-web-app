// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Alert, Button, Col, Modal, Result, Row} from "antd";
import {Link, withRouter} from "react-router-dom";
import BillingAPI from "../../services/BillingAPI";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../models/UserProfile";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import UserProfileAPI from "../../services/UserProfileAPI";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import Loading from "../../components/Loading";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import Invoice from "./Invoice";

export const PREMIUM_PRICE_BEFORE_TAX = 9;
export const PREMIUM_PRICE_WITH_TAX = 10.17;
class PremiumCheckoutForm extends React.Component {

    constructor(props) {
        super(props);
        const { userProfile } = this.props;
        this.state = {
            isLoggedInModalVisible: !userProfile,
            cardHolderName: "",
            addressCountry: "",
            isResponseLoading: false,
            isResponseLoadingMessage: "",
            isResponseErrorMessage: null,
            isResponseLoadingFinishedText: null,
            isPaymentSuccess: false,
            // have to set it here, otherwise it may get set after user subscribes for an account
            // then instead of showing 'Payment successful' it showed 'You already have a premium account'
            isPremiumOnLoad: userProfile && userProfile.is_atila_premium,
        }
    }

    handleSubmit = async (ev) => {
        ev.preventDefault();
        const { stripe, userProfile, updateLoggedInUserProfile } = this.props;

        const { first_name, last_name, email, user } = userProfile;
        const fullName = `${first_name} ${last_name}`;
        const metadata = {
            atila_user_id: user,
        };
        const { cardHolderName} = this.state;

        this.setState({isResponseLoading: true});
        this.setState({isResponseLoadingMessage: 'Processing Payment'});
        this.setState({isResponseErrorMessage: null});
        const createTokenResult = await stripe.createToken({name: cardHolderName});
        if (createTokenResult.token) {

            try {
                const { data : { data : { customerId } }} = await BillingAPI
                    .chargePayment(createTokenResult.token.id, fullName, email, metadata);

                this.setState({isResponseLoadingMessage: 'Payment Successful! 🙂 Saving UserProfile'});

                try {
                    const {data : updateUserProfileResponse} = await UserProfileAPI
                        .patch({is_atila_premium: true, stripe_customer_id: customerId}, user);
                    updateLoggedInUserProfile(updateUserProfileResponse);

                } catch (patchUserProfileError) {
                    BillingAPI
                        .sendBillingError(patchUserProfileError, {email, name: fullName});
                }
                const isResponseLoadingFinishedText = (<div>
                    Payment was successful Check out <Link to="/scholarship" >scholarships</Link>, <Link to="/blog" >blog</Link> and {' '}
                    <Link to="/essay" >essays</Link>
                </div>);
                this.setState({isResponseLoadingFinishedText, isPaymentSuccess: true});

            } catch (chargePaymentError) {
                BillingAPI
                    .sendBillingError(chargePaymentError, {email, name: fullName});
                const { response } = chargePaymentError;
                if (response && response.data && response.data.error) {
                    this.setState({isResponseErrorMessage: response.data.error.message});
                } else {
                    this.setState({isResponseErrorMessage: chargePaymentError.message || JSON.stringify(chargePaymentError)});
                }
            }

        } else if (createTokenResult.error) {
            console.log(createTokenResult.error);
            this.setState({isResponseErrorMessage: createTokenResult.error.message || createTokenResult.error});
        }
        this.setState({isResponseLoading: false});
    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    handleOk = e => {
        this.setState({
            isLoggedInModalVisible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            isLoggedInModalVisible: false,
        });
    };

    render() {

        const { userProfile, location: { pathname, search } } = this.props;
        const { cardHolderName, isResponseLoading, isResponseLoadingMessage,
            isPaymentSuccess, isResponseLoadingFinishedText,
            isResponseErrorMessage, isLoggedInModalVisible, isPremiumOnLoad} = this.state;

        const isResponseErrorMessageWithContactLink = (<div>
            {isResponseErrorMessage}
            <br /> <Link to="/contact"> Contact us</Link> if problem continues
        </div>);

        const seoContent = {
            title: 'Atila Student Premium Checkout - $9/month',
            description: 'Get a premium student membership to Atila starting at just $9/month',
            image: defaultSeoContent.image,
            slug: '/premium'
        };

        const helmetSeo = (<HelmetSeo content={seoContent} />);
        const redirectString = `?redirect=${pathname}${search}`;
        const loginToUsePremiumTitle = "You Must be Logged In";
        const loginToUsePremium = (<div className="center-block">
            <Link to={`/login${redirectString}`}>Login</Link>{' '} or {' '}
            <Link to={`/register${redirectString}`}>Register</Link>
            {' '} to continue with Atila Premium checkout
        </div>);

        if(!userProfile) {
            return (
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <Modal
                            visible={isLoggedInModalVisible}
                            title={loginToUsePremiumTitle}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    <Link to={`/login${redirectString}`}>Login</Link>
                                </Button>,
                                <Button key="submit" type="primary" onClick={this.handleOk}>
                                    <Link to={`/register${redirectString}`}>Register</Link>
                                </Button>,
                            ]}
                        >
                            <Link to={`/login${redirectString}`}>Login</Link>{' '}
                            or{' '}
                            <Link to={`/register${redirectString}`}>Register</Link>{' '}
                            to continue with Atila Premium checkout
                        </Modal>
                        <h1>{loginToUsePremiumTitle}</h1>
                    {loginToUsePremium}
                    </div>
                </div>
            )
        }

        if (isPremiumOnLoad) {
            return (
                <React.Fragment>
                    {helmetSeo}
                    <div className="container mt-5" style={{ height: '80vh'}}>
                        <div className="card shadow p-3">
                            <div className="text-center">
                                <h1>
                                    You already have a premium account
                                </h1>

                                <Link to={`/profile/${userProfile.username}/settings`}>
                                    View Your Account Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                {helmetSeo}
                <div className="container mt-5" style={{ height: '80vh'}}>
                    <div className="card shadow p-3">
                        <h1>Student Premium Checkout</h1>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <div className="checkout-form-container">
                                    {isPaymentSuccess &&
                                    <Result
                                        status="success"
                                        title="Payment Success 🙂"
                                        subTitle={isResponseLoadingFinishedText}
                                        extra={[
                                            <p key="next-steps">Next Steps:</p>,
                                            <Link to="/scholarship" key="scholarship">
                                                View Scholarships
                                            </Link>,
                                            <Link to="/blog" key="blog">
                                                View Blog Posts
                                            </Link>,
                                            <Link to="/essay" key="essay">
                                                View Essays
                                            </Link>,
                                        ]}
                                    />
                                    }
                                </div>
                                {!isPaymentSuccess &&
                                <form onSubmit={this.handleSubmit}>
                                    <Row gutter={16}>
                                        <Col span={24} className="mb-3">
                                            <input placeholder="Cardholder Name"
                                                   name="cardHolderName"
                                                   className="form-control"
                                                   value={cardHolderName}
                                                   onChange={this.updateForm}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <CardElement style={{base: {fontSize: '18px'}}} />
                                        </Col>
                                    </Row>

                                    <Button className="col-12 my-3"
                                            type="primary"
                                            size="large"
                                            disabled={isResponseLoading}
                                            onClick={this.handleSubmit}>
                                        Confirm order (${PREMIUM_PRICE_WITH_TAX}/month)
                                    </Button>

                                    {isResponseLoading &&

                                    <Loading
                                        isLoading={isResponseLoading}
                                        title={isResponseLoadingMessage} />
                                    }

                                    {isResponseErrorMessage &&
                                    <Alert
                                        type="error"
                                        message={isResponseErrorMessageWithContactLink}
                                    />
                                    }

                                </form>}
                            </Col>
                            <Col xs={24} md={12}>
                                <Invoice />
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PremiumCheckoutForm.defaultProps = {
    userProfile: null
};

PremiumCheckoutForm.propTypes = {
    userProfile: UserProfilePropType
};
const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default injectStripe(withRouter(connect(mapStateToProps, mapDispatchToProps)(PremiumCheckoutForm)));

export const  PremiumCheckoutFormTest = PremiumCheckoutForm;
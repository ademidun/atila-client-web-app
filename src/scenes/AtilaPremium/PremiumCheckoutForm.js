// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Alert, Button, Col, Result, Row} from "antd";
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
                    // todo send an email to admin that payment went through
                    //  but there was an error saving info to userProfile
                }
                const isResponseLoadingFinishedText = (<div>
                    Payment was successful Check out <Link to="/scholarship" >scholarships</Link>, <Link to="/blog" >blog</Link> and {' '}
                    <Link to="/essay" >essays</Link>
                </div>);
                this.setState({isResponseLoadingFinishedText, isPaymentSuccess: true});

            } catch (chargePaymentError) {
                // todo send an email to admin that error occurred at payment
                const { response : { data : {error : { message }}}} = chargePaymentError;

                this.setState({isResponseErrorMessage: message});
            }

        } else if (createTokenResult.error) {
            // todo send an email to admin that error occurred at payment
            this.setState({isResponseErrorMessage: createTokenResult.error.message});
            console.log(createTokenResult.error);
        }
        this.setState({isResponseLoading: false});
    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    render() {

        const { userProfile } = this.props;
        const { cardHolderName, isResponseLoading, isResponseLoadingMessage,
            isPaymentSuccess, isResponseLoadingFinishedText,
            isResponseErrorMessage} = this.state;

        const subscribeText = (<h3>
            Join the Waiting List. Get Notified When Atila Premium Launches
        </h3>);

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
        if(!userProfile || !userProfile.is_atila_admin) {
            return (
                <React.Fragment>
                    {helmetSeo}
                    <div className="container mt-5">
                        <div className="card shadow p-3">
                            <div className="text-center">
                                <h1>
                                    Atila Premium Coming Soon
                                    <span role="img" aria-label="eyes and clock emoji">👀 🕛</span>
                                </h1>

                                <SubscribeMailingList subscribeText={subscribeText}
                                                      btnText="Join Waiting List" />
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                {helmetSeo}
                <div className="container mt-5">
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
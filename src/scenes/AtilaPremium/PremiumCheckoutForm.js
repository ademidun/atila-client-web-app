// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Button, Col, Result, Row} from "antd";
import {Link, withRouter} from "react-router-dom";
import BillingAPI from "../../services/BillingAPI";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../models/UserProfile";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import UserProfileAPI from "../../services/UserProfileAPI";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import Loading from "../../components/Loading";


class PremiumCheckoutForm extends React.Component {

    constructor(props) {
        super(props);
        const { userProfile } = this.props;
        this.state = {
            isLoggedInModalVisible: !userProfile,
            cardHolderName: "",
            addressCountry: "",
            isLoadingResponse: false,
            isLoadingResponseText: "",
            isFinishedLoadingResponseText: null,
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

        this.setState({isLoadingResponse: true});
        this.setState({isLoadingResponseText: 'Processing Payment'});
        const createTokenResult = await stripe.createToken({name: cardHolderName});
        if (createTokenResult.token) {

            const { data : { data : { customerId } }} = await BillingAPI
                .chargePayment(createTokenResult.token.id, fullName, email, metadata);

            this.setState({isLoadingResponseText: 'Payment Successful! 🙂 Saving UserProfile'});
            const {data : updateUserProfileResponse} = await UserProfileAPI
                .patch({is_atila_premium: true, stripe_customer_id: customerId}, user);
            updateLoggedInUserProfile(updateUserProfileResponse);

            const isFinishedLoadingResponseText = (<div>
               Payment was successful Check out <Link to="/scholarship" >scholarships</Link>, <Link to="/blog" >blog</Link> and {' '}
                <Link to="/essay" >essays</Link>
            </div>);
            this.setState({isFinishedLoadingResponseText, isPaymentSuccess: true});

        } else if (createTokenResult.error) {
            console.log(createTokenResult.error);
        }
        this.setState({isLoadingResponse: false});
    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    render() {

        const { userProfile } = this.props;
        const { cardHolderName, isLoadingResponse, isLoadingResponseText,
            isPaymentSuccess, isFinishedLoadingResponseText } = this.state;

        const subscribeText = (<h3>
            Join the Waiting List. Get Notified When Atila Premium Launches
        </h3>);
        if(!userProfile || !userProfile.is_atila_admin) {
            return (
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
            )
        }
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>Student Premium Checkout</h1>
                    <div className="checkout-form-container">
                        {isPaymentSuccess &&
                        <Result
                            status="success"
                            title="Payment Success 🙂"
                            subTitle={isFinishedLoadingResponseText}
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
                                disabled={isLoadingResponse}
                                onClick={this.handleSubmit}>
                            Confirm order
                        </Button>

                        {isLoadingResponse &&

                        <Loading
                            isLoading={isLoadingResponse}
                            title={isLoadingResponseText} />
                        }

                    </form>}
                </div>
            </div>
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
// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Alert, Button, Col, Result, Row} from "antd";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../../models/UserProfile";
import {updateLoggedInUserProfile} from "../../../redux/actions/user";
import Loading from "../../../components/Loading";
import HelmetSeo, {defaultSeoContent} from "../../../components/HelmetSeo";
import Invoice from "./Invoice";
import ScholarshipsAPI from "../../../services/ScholarshipsAPI";
import {ATILA_SCHOLARSHIP_FEE} from "../../../models/Constants";
import {formatCurrency} from "../../../services/utils";
import PaymentAPI from "../../../services/PaymentAPI";

export const PREMIUM_PRICE_BEFORE_TAX = 9;
export const PREMIUM_PRICE_WITH_TAX = 10.17;
class PaymentSendForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cardHolderName: "",
            addressCountry: "",
            isResponseLoading: false,
            isResponseLoadingMessage: "",
            isResponseErrorMessage: null,
            isResponseLoadingFinishedText: null,
            isPaymentSuccess: false,
            totalPaymentAmount: null,
            // Leaving the following message in case it's relevant to an error I might encounter when funding scholarships
            // have to set it here, otherwise it may get set after user subscribes for an account
            // then instead of showing 'Payment successful' it showed 'You already have a premium account'
        }

        this.cardElementRef = React.createRef();
    }

    componentDidMount() {
        const { userProfile } = this.props;
        if (!userProfile || !userProfile.is_debug_mode) {
            return
        }

        this.getScholarship();
    }

    getScholarship = () => {
        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);

        let scholarshipID = params.get('scholarship');
        this.setState({isResponseLoading: "Retrieving Scholarship..."});

        ScholarshipsAPI
            .get(scholarshipID)
            .then(res=> {
                const {data : scholarship} = res;
                // totalPaymentAmount = scholarship.funding_amount + (Atila 5% fee + 13% tax)
                const totalPaymentAmount = Number.parseInt(scholarship.funding_amount)  +
                    (ATILA_SCHOLARSHIP_FEE * 1.13 * Number.parseInt(scholarship.funding_amount));

                this.setState({scholarship, totalPaymentAmount});
            })
            .catch(err=> {
                console.log({err})
            })
            .finally(() => {
                this.setState({isResponseLoading: null});
                // this.createStripeElements();
            })
    };

    handleSubmit = async (ev) => {
        ev.preventDefault();
        const { stripe, userProfile, elements } = this.props;
        console.log({elements});
        console.log({stripe});
        console.log("stripe.elements", stripe.elements);
        console.log("stripe.elements()", stripe.elements());

        const { first_name, last_name } = userProfile;
        const fullName = `${first_name} ${last_name}`;
        const { scholarship, totalPaymentAmount} = this.state;

        this.setState({isResponseLoading: true});
        this.setState({isResponseLoadingMessage: 'Processing Payment'});
        this.setState({isResponseErrorMessage: null});

        const paymentData = {
            scholarship: {funding_amount: totalPaymentAmount, name: scholarship.name}
        };

        try{
            const {data: clientSecretData} = await PaymentAPI.getClientSecret(paymentData);
             console.log({clientSecretData});
            try {
                console.log("this.cardElementRef", this.cardElementRef);
                console.log({CardElement});
                console.log({clientSecretData});
                console.log(clientSecretData.client_secret);
                const cardPaymentResult = await stripe.confirmCardPayment(clientSecretData.client_secret, {
                    payment_method: {
                        card: this.cardElementRef.current._element,
                        billing_details: {
                            name: fullName
                        }
                    }
                });

                console.log({cardPaymentResult});

                if (cardPaymentResult.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    console.log(cardPaymentResult.error.message);
                } else {
                    // The payment has been processed!
                    if (cardPaymentResult.paymentIntent.status === 'succeeded') {
                        const isResponseLoadingFinishedText = (<div>
                            Payment was successful. See your live scholarship at:
                            <Link to={`/scholarship/${scholarship.slug}`} >{scholarship.name}</Link>
                        </div>);
                        this.setState({isResponseLoadingFinishedText, isPaymentSuccess: true});
                        // Show a success message to your customer
                        // There's a risk of the customer closing the window before callback
                        // execution. Set up a webhook or plugin to listen for the
                        // payment_intent.succeeded event that handles any business critical
                        // post-payment actions.
                        // TODO Update Scholarship.is_funded attribute and Scholarship.published
                    }
                }

            } catch (confirmCardPaymentError) {
                console.log({confirmCardPaymentError});
                this.setState({isResponseErrorMessage: JSON.stringify(confirmCardPaymentError)});
            }

        } catch (getClientSecretError) {
            console.log({getClientSecretError});
            this.setState({isResponseErrorMessage: JSON.stringify(getClientSecretError)});
        }

        this.setState({isResponseLoading: false});

        /*

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

        */
    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    render() {

        const { cardHolderName, isResponseLoading, isResponseLoadingMessage,
            isPaymentSuccess, isResponseLoadingFinishedText,
            isResponseErrorMessage, scholarship, totalPaymentAmount} = this.state;

        const isResponseErrorMessageWithContactLink = (<div>
            {isResponseErrorMessage}
            <br /> <Link to="/contact"> Contact us</Link> if problem continues
        </div>);

        const seoContent = {
            title: 'Atila - Fund Scholarship',
            description: 'Fund a scholarship on Atila',
            image: defaultSeoContent.image,
            slug: '/payment/send'
        };

        let helmetSeo = (<HelmetSeo content={seoContent} />);

        if (!scholarship) {
            return (
                <React.Fragment>
                    {helmetSeo}
                    <div className="container mt-5" style={{ height: '80vh'}}>
                        <div className="card shadow p-3">
                            {isResponseLoading &&
                            <Loading
                                title={isResponseLoading} />
                            }
                        </div>
                    </div>
                </React.Fragment>
            )
        }

        seoContent.title = `Fund ${scholarship.name}`;
        helmetSeo = (<HelmetSeo content={seoContent} />);

        return (
            <React.Fragment>
                {helmetSeo}
                <div className="container mt-5" style={{ height: '80vh'}}>
                    <div className="card shadow p-3">
                        <h1>Fund{' '}
                            <Link to={`/scholarship/${scholarship.slug}`}>
                                {scholarship.name}
                            </Link>
                        </h1>
                        <h5 className="center-block">
                            <Link to={`/scholarship/edit/${scholarship.slug}`}>
                                Edit Scholarship
                            </Link>
                        </h5>

                        <Row gutter={16}>
                            <Col sm={24} md={12}>
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
                                            <div id="card-element">

                                            </div>

                                            <CardElement style={{base: {fontSize: '18px'}}} ref={this.cardElementRef} />

                                            <p className="my-3">
                                                Test with: 4000001240000000
                                            </p>
                                        </Col>
                                    </Row>

                                    <Button className="col-12 my-3"
                                            type="primary"
                                            size="large"
                                            disabled={isResponseLoading}
                                            onClick={this.handleSubmit}>
                                        Confirm order ({formatCurrency(totalPaymentAmount)})
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
                            <Col sm={24} md={12}>
                                <Invoice scholarship={scholarship} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PaymentSendForm.defaultProps = {
    userProfile: null
};

PaymentSendForm.propTypes = {
    userProfile: UserProfilePropType
};
const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default injectStripe(withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentSendForm)));

export const  PremiumCheckoutFormTest = PaymentSendForm;
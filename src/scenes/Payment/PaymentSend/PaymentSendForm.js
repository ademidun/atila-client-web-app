// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Alert, Button, Col, Result, Row} from "antd";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../../models/UserProfile";
import {updateLoggedInUserProfile} from "../../../redux/actions/user";
import Loading from "../../../components/Loading";
import Invoice from "./Invoice";
import ScholarshipsAPI from "../../../services/ScholarshipsAPI";
import {ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT, ATILA_SCHOLARSHIP_FEE} from "../../../models/Constants";
import {formatCurrency, getErrorMessage} from "../../../services/utils";
import PaymentAPI from "../../../services/PaymentAPI";
import {ScholarshipPropType} from "../../../models/Scholarship";
import PropTypes from "prop-types";

export const PREMIUM_PRICE_BEFORE_TAX = 9;
export const PREMIUM_PRICE_WITH_TAX = 10.17;
class PaymentSendForm extends React.Component {

    constructor(props) {
        super(props);

        const { scholarship } = props;

        // totalPaymentAmount = scholarship.funding_amount + (Atila 9% fee + 13% tax)
        const totalPaymentAmount = Number.parseInt(scholarship.funding_amount)  +
            (ATILA_SCHOLARSHIP_FEE * 1.13 * Number.parseInt(scholarship.funding_amount));

        this.state = {
            cardHolderName: "",
            addressCountry: "",
            isResponseLoading: false,
            isResponseLoadingMessage: "",
            isResponseErrorMessage: null,
            isPaymentSuccess: scholarship.is_funded,
            totalPaymentAmount,
            // Leaving the following message in case it's relevant to an error I might encounter when funding scholarships
            // have to set it here, otherwise it may get set after user subscribes for an account
            // then instead of showing 'Payment successful' it showed 'You already have a premium account'
        };

        this.cardElementRef = React.createRef();
    }

    handleSubmit = async (ev) => {
        ev.preventDefault();
        const { stripe, userProfile, scholarship, updateScholarship } = this.props;

        const { first_name, last_name, email } = userProfile;
        const fullName = `${first_name} ${last_name}`;
        const { totalPaymentAmount} = this.state;

        this.setState({isResponseLoading: true});
        this.setState({isResponseLoadingMessage: 'Processing Payment'});
        this.setState({isResponseErrorMessage: null});

        const paymentData = {
            scholarship: { funding_amount: totalPaymentAmount, name: scholarship.name, id: scholarship.id }
        };

        try{
            const {data: clientSecretData} = await PaymentAPI.getClientSecret(paymentData);
            try {
                const cardPaymentResult = await stripe.confirmCardPayment(clientSecretData.client_secret, {
                    payment_method: {
                        card: this.cardElementRef.current._element,
                        billing_details: {
                            name: fullName,
                            email: email,
                        },
                    },
                });

                if (cardPaymentResult.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    console.log(cardPaymentResult.error.message);
                    this.setState({isResponseErrorMessage: getErrorMessage(cardPaymentResult)});
                } else {
                    // The payment has been processed!
                    if (cardPaymentResult.paymentIntent.status === 'succeeded') {

                        ScholarshipsAPI
                            .patch(scholarship.id, {stripe_payment_intent_id: cardPaymentResult.paymentIntent.id, is_funded: true})
                            .then(res => {
                                const { data: scholarship } = res;
                                updateScholarship(scholarship);
                            })
                            .catch(err => {
                                console.log({err});
                            })
                            .finally(() => {
                                this.setState({isLoading: 'Saving Progress'});
                                this.setState({isPaymentSuccess: true});
                            });
                    }
                }

            } catch (confirmCardPaymentError) {
                console.log({confirmCardPaymentError});
                console.log("getErrorMessage(confirmCardPaymentError)", getErrorMessage(confirmCardPaymentError));
                this.setState({ isResponseErrorMessage: getErrorMessage(confirmCardPaymentError) });
            }

        } catch (getClientSecretError) {
            console.log({getClientSecretError});
            console.log("getErrorMessage(getClientSecretError)", getErrorMessage(getClientSecretError));
            this.setState({isResponseErrorMessage: getErrorMessage(getClientSecretError)});
        }

        this.setState({isResponseLoading: false});
    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    render() {
        const { userProfile, scholarship } = this.props;
        if (!userProfile) {
            return (<h3>
                You do not have permission to access this page.
            </h3>)
        }

        const { cardHolderName, isResponseLoading, isResponseLoadingMessage,
            isPaymentSuccess,
            isResponseErrorMessage, totalPaymentAmount} = this.state;

        const isResponseErrorMessageWithContactLink = (<div>
            {isResponseErrorMessage}
            <br /> <Link to="/contact"> Contact us</Link> if problem continues
        </div>);

        if (!scholarship) {
            return (
                <React.Fragment>
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

        let canFundScholarship = scholarship.id && Number.parseInt(scholarship.funding_amount) >= ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT;
        let canFundScholarshipMessage = `Confirm order (${formatCurrency(totalPaymentAmount)})`;

        if (!canFundScholarship) {
            if (!scholarship.id) {
                canFundScholarshipMessage = "You must save scholarship before you can fund";
            } else {
                canFundScholarshipMessage = (<React.Fragment>
                    Scholarship funding amount <br/>
                    must be greater than or equal to
                    ${ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT}
                </React.Fragment>);
            }
        }

        const isPaymentSuccessText = (<div>
            Payment was successful. See your live scholarship at: <br/>
            <Link to={`/scholarship/${scholarship.slug}`} >{scholarship.name}</Link> <br/>
            Check your email inbox for your receipt.
        </div>);

        return (
            <React.Fragment>
                <div className="container">

                    <Row gutter={16}>
                        <Col sm={24} md={12}>
                            <div className="checkout-form-container">
                                {isPaymentSuccess &&
                                <Result
                                    status="success"
                                    title="Your Scholarship has been funded 🙂"
                                    subTitle={isPaymentSuccessText}
                                    extra={[
                                        <p key="next-steps">
                                            Next Steps:
                                        </p>,
                                        <Link to={`/scholarship/${scholarship.slug}`} key="view">
                                            View Scholarship
                                        </Link>,
                                        <Link to={`/scholarship/${scholarship.id}/manage`} key="manage">
                                            Manage Applications
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
                                        style={{height: "auto"}}
                                        disabled={isResponseLoading || !canFundScholarship}
                                        onClick={this.handleSubmit}>
                                    {canFundScholarshipMessage}
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
            </React.Fragment>
        );
    }
}

PaymentSendForm.defaultProps = {
    userProfile: null
};

PaymentSendForm.propTypes = {
    userProfile: UserProfilePropType,
    scholarship: ScholarshipPropType,
    updateScholarship: PropTypes.func,
};
const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default injectStripe(withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentSendForm)));

export const  PremiumCheckoutFormTest = PaymentSendForm;
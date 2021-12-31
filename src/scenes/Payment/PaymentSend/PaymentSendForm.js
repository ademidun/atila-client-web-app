// CheckoutForm.js
import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Alert, Button, Col, Result, Row, Checkbox} from "antd";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../../models/UserProfile";
import {updateLoggedInUserProfile} from "../../../redux/actions/user";
import Loading from "../../../components/Loading";
import Invoice from "./Invoice";
import ScholarshipsAPI from "../../../services/ScholarshipsAPI";
import {
    ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP,
    ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_START_SCHOLARSHIP,
    ATILA_SCHOLARSHIP_FEE, ATILA_SCHOLARSHIP_FEE_TAX
} from "../../../models/Constants";
import {formatCurrency, getErrorMessage} from "../../../services/utils";
import PaymentAPI from "../../../services/PaymentAPI";
import {ScholarshipDisableEditMessage, ScholarshipPropType, ScholarshipFundingWillPublishMessage} from "../../../models/Scholarship";
import Environment from "../../../services/Environment";
import ScholarshipSponsorAgreement from "../../../components/ScholarshipSponsorAgreement";
import ButtonModal from "../../../components/ButtonModal";

export const PREMIUM_PRICE_BEFORE_TAX = 9;
export const PREMIUM_PRICE_WITH_TAX = 10.17;
class PaymentSendForm extends React.Component {

    constructor(props) {
        super(props);

        const { scholarship, contributor, userProfile } = props;
        const { location } = props;
        let { contributorFundingAmount } = props;
        let cardHolderName = "";
        let isScholarshipOwner = false;

        if (userProfile) {
            isScholarshipOwner = scholarship.owner === userProfile.user;
        }

        if (contributor && contributor.first_name && contributor.last_name) {
            cardHolderName = `${contributor.first_name} ${contributor.last_name}`;
        }

        let isScholarshipEditMode = location.pathname.includes('/scholarship/edit/') || location.pathname === "/scholarship/add" || location.pathname === "/scholarship/add/";

        let minimumFundingAmount = ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP;

        if (isScholarshipEditMode) {
            minimumFundingAmount = ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_START_SCHOLARSHIP;
        }


        if (!contributorFundingAmount) {
            contributorFundingAmount = scholarship.funding_amount;
        }

        // totalPaymentAmount = contributorFundingAmount + (Atila 9% fee + 13% tax)
        const totalPaymentAmount = Number.parseInt(contributorFundingAmount)  +
            (ATILA_SCHOLARSHIP_FEE * (1 + ATILA_SCHOLARSHIP_FEE_TAX) * Number.parseInt(contributorFundingAmount));

        this.state = {
            cardHolderName,
            addressCountry: "",
            isResponseLoading: false,
            isResponseLoadingMessage: "",
            isResponseErrorMessage: null,
            isPaymentSuccess: isScholarshipEditMode && scholarship.is_funded,
            isScholarshipEditMode,
            totalPaymentAmount,
            contributor,
            contributorFundingAmount,
            isScholarshipOwner,
            minimumFundingAmount,
            agreeSponsorAgreement: false,
        };

        this.cardElementRef = React.createRef();
    }

    fundScholarship = (data) => {
        const { scholarship, onFundingComplete } = this.props;
        this.setState({isResponseLoading: true});
        this.setState({isResponseLoadingMessage: 'Saving Contribution'});
        ScholarshipsAPI
            .fundScholarship(scholarship.id, data)
            .then(res => {
                onFundingComplete(res.data)
            })
            .catch(err => {
                this.setState({isResponseErrorMessage: getErrorMessage(err)});
                console.log({err});
            })
            .finally(() => {
                this.setState({isResponseLoading: false});
            })
    };

    handleSubmit = async (ev) => {
        ev.preventDefault();
        const { stripe, scholarship } = this.props;

        const { totalPaymentAmount, contributor, contributorFundingAmount, cardHolderName } = this.state;
        const { email } = contributor;

        this.setState({isResponseLoading: true});
        this.setState({isResponseLoadingMessage: 'Processing Payment'});
        this.setState({isResponseErrorMessage: null});

        const paymentData = {
            scholarship: { name: scholarship.name, id: scholarship.id },
            funding_amount: totalPaymentAmount,
            contributor,
        };

        try{
            const {data: clientSecretData} = await PaymentAPI.getClientSecret(paymentData);
            try {
                const cardPaymentResult = await stripe.confirmCardPayment(clientSecretData.client_secret, {
                    payment_method: {
                        card: this.cardElementRef.current._element,
                        billing_details: {
                            name: cardHolderName,
                            email: email,
                        },
                    },
                });

                if (cardPaymentResult.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    let isResponseErrorMessage = cardPaymentResult.error.message;
                    if (cardPaymentResult.error.message.includes("postal code is incomplete")) {
                        isResponseErrorMessage += "\nHint: If you can't see the field to enter your postal code," +
                            " try selecting your expiry date."
                    }
                    this.setState({isResponseErrorMessage});
                    this.setState({isResponseLoading: false});
                } else {
                    // The payment has been processed!
                    if (cardPaymentResult.paymentIntent.status === 'succeeded') {
                        this.setState({isPaymentSuccess: true});
                        this.setState({isResponseLoading: false});

                        this.fundScholarship({ stripe_payment_intent_id: cardPaymentResult.paymentIntent.id,
                                                     contributor, funding_amount: contributorFundingAmount});
                    }
                }

            } catch (confirmCardPaymentError) {
                console.log({confirmCardPaymentError});
                console.log("getErrorMessage(confirmCardPaymentError)", getErrorMessage(confirmCardPaymentError));
                this.setState({ isResponseErrorMessage: getErrorMessage(confirmCardPaymentError) });
                this.setState({isResponseLoading: false});
            }

        } catch (getClientSecretError) {
            console.log({getClientSecretError});
            console.log("getErrorMessage(getClientSecretError)", getErrorMessage(getClientSecretError));
            this.setState({isResponseErrorMessage: getErrorMessage(getClientSecretError)});
            this.setState({isResponseLoading: false});
        }

    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    render() {
        const { scholarship } = this.props;

        const { cardHolderName, isResponseLoading, isResponseLoadingMessage,
            isPaymentSuccess, isScholarshipOwner,
            isResponseErrorMessage, totalPaymentAmount, contributorFundingAmount,
            contributor, minimumFundingAmount, agreeSponsorAgreement} = this.state;

        const isResponseErrorMessageWithContactLink = (<div style={{whiteSpace: "pre-line"}}>
            {isResponseErrorMessage}
            <br /> <Link to="/contact" target="_blank" rel="noopener noreferrer"> Contact us</Link> if problem continues (opens in new tab)
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

        let canFundScholarship = scholarship.id && Number.parseInt(contributorFundingAmount) >= minimumFundingAmount && agreeSponsorAgreement;
        let canFundScholarshipMessage = `Confirm order (${formatCurrency(totalPaymentAmount)})`;

        if (!canFundScholarship) {
            if (!scholarship.id) {
                canFundScholarshipMessage = "You must save scholarship before you can fund";
            } else if (!agreeSponsorAgreement) {
                canFundScholarshipMessage = "You must agree to the Scholarship Sponsors agreement";
            } else {
                canFundScholarshipMessage = (<React.Fragment>
                    Scholarship funding amount <br/>
                    must be greater than or equal to
                    ${minimumFundingAmount}
                </React.Fragment>);
            }
        }

        let modalTitle = (
            <>
                Scholarship Sponsors Agreement &nbsp;&nbsp;&nbsp;
                <Link to="/scholarship-sponsor-agreement" target={"_blank"} rel={"noopener noreferrer"}>
                    <Button>View Agreement In New Tab</Button>
                </Link>
            </>
        )

        return (
            <React.Fragment>
                <div className="container">

                    {isResponseLoading &&
                        <Loading
                            isLoading={isResponseLoading}
                            title={isResponseLoadingMessage} />
                    }

                    <Row gutter={16}>
                        <Col sm={24} md={12}>
                            {isPaymentSuccess &&
                                <div className="checkout-form-container">
                                    <Result
                                        status="success"
                                        title="Scholarship Contribution was Successful 🙂"
                                        subTitle="Check your email for your receipt."
                                        extra={[
                                            <Link to={`/scholarship/${scholarship.slug}`} key="view">
                                                View Scholarship: {scholarship.name}
                                            </Link>,
                                        ]}
                                    />
                                </div>
                            }
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

                                        {["dev", "staging"].includes(Environment.name) &&
                                        <p className="my-3">
                                            Test with: 4000001240000000
                                        </p>
                                        }
                                    </Col>
                                </Row>

                                <Fragment>
                                        <Checkbox checked={agreeSponsorAgreement}
                                                  onChange={(e)=>{this.setState({agreeSponsorAgreement: e.target.checked})}}
                                        />
                                        &nbsp;&nbsp;I agree to the
                                        <ButtonModal
                                                showModalText={"Scholarship Sponsor Agreement"}
                                                showModalButtonType={"link"}
                                                modalTitle={modalTitle}
                                                modalBody={<ScholarshipSponsorAgreement openInNewTab={true} />}
                                                style={{display: 'inline-block'}}
                                                customFooter={null}
                                        />
                                </Fragment>

                                <Button className="col-12 my-3"
                                        type="primary"
                                        size="large"
                                        style={{height: "auto"}}
                                        disabled={isResponseLoading || !canFundScholarship || isPaymentSuccess}
                                        onClick={this.handleSubmit}>
                                    {canFundScholarshipMessage}
                                </Button>

                                {isScholarshipOwner && !scholarship.is_funded &&
                                    <>
                                        <ScholarshipFundingWillPublishMessage />
                                        <br />
                                        <ScholarshipDisableEditMessage />
                                        <br />
                                    </>
                                }

                            </form>
                            }


                            {isResponseErrorMessage &&
                                <Alert
                                    type="error"
                                    message={isResponseErrorMessageWithContactLink}
                                    className="mb-3"
                                />
                            }
                        </Col>
                        <Col sm={24} md={12}>
                            <Invoice scholarship={scholarship}
                                     contributorFundingAmount={contributorFundingAmount}
                                     cardHolderName={cardHolderName}
                                     contributor={contributor}/>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

PaymentSendForm.defaultProps = {
    userProfile: null,
    contributor: {
        "is_anonymous": false,
        "first_name": "",
        "last_name": "",
        "email": "",
        "user": null,
    },
    contributorFundingAmount: null,
};

PaymentSendForm.propTypes = {
    userProfile: UserProfilePropType,
    scholarship: ScholarshipPropType,
    onFundingComplete: PropTypes.func,
    contributor: PropTypes.shape({}),
    contributorFundingAmount: PropTypes.number,
};
const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default injectStripe(withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentSendForm)));

export const  PremiumCheckoutFormTest = PaymentSendForm;
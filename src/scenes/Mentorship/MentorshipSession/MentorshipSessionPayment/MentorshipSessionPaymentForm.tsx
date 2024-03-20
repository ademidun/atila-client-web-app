import React, { FormEvent, KeyboardEventHandler, useRef, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { connect } from 'react-redux';
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import { ATILA_MENTORSHIP_FEE, ATILA_SCHOLARSHIP_FEE_TAX } from '../../../../models/ConstantsPayments';
import { DiscountCode, MentorshipSession } from '../../../../models/MentorshipSession';
import { UserProfile } from '../../../../models/UserProfile.class';
import MentorshipSesssionAPI from '../../../../services/Mentorship/MentorshipSessionAPI';
import { formatCurrency, getErrorMessage } from '../../../../services/utils';
import Environment from '../../../../services/Environment';
import MentorshipSessionInvoice from './MentorshipSessionInvoice';
import PaymentAPI from '../../../../services/PaymentAPI';
import { NetworkResponse, NetworkResponseDisplay } from '../../../../components/NetworkResponse';

interface MentorshipSessionPaymentFormProps extends ReactStripeElements.InjectedStripeProps {
    session: MentorshipSession,
    onPaymentComplete: (paymentDetails: any) => void,
    userProfileLoggedIn?: UserProfile,
}

function MentorshipSessionPaymentForm(props: MentorshipSessionPaymentFormProps) {

    const { session, userProfileLoggedIn, stripe, onPaymentComplete } = props;
    const cardElementRef = useRef(null);
    const [cardHolderName, setCardHolderName] = useState(userProfileLoggedIn ?
         `${userProfileLoggedIn.first_name} ${userProfileLoggedIn.last_name}`: "");
    const [cardHolderEmail, setCardHolderEmail] = useState(userProfileLoggedIn?.email||"");
    const [networkResponse, setNetworkResponse] = useState<NetworkResponse>({title: "", type: null})
    let mentorShipSession = session; // should we just change session to a let?

    const [discountCode, setDiscountCode] = useState<DiscountCode>({code: '', id: ''});
    if (!mentorShipSession?.duration) {
        return null
    }

    const mentorPrice = Number.parseFloat(mentorShipSession.duration.price.toString());
    const mentorshipFee =  mentorPrice * ATILA_MENTORSHIP_FEE;
    const mentorshipTax =  (mentorPrice + mentorshipFee) * ATILA_SCHOLARSHIP_FEE_TAX;
    const totalPaymentAmount =  mentorPrice + mentorshipTax + mentorshipFee;

    const handleVerifyDiscountCode = async (event: FormEvent) => {
        event.preventDefault();
        setNetworkResponse({title: "Verifying scholarship code", type: "loading"});
        try {
            const {data: verificationResponse} = await MentorshipSesssionAPI.verifyDiscountCode({code: discountCode.code!});
            setNetworkResponse({title: "Succesfully verified code", type: "success"});
            setDiscountCode(verificationResponse.discount_code);
        } catch (verifyDiscountCodeError) {
            console.log({verifyDiscountCodeError});
            setNetworkResponse({title: getErrorMessage(verifyDiscountCodeError), type: "error"});
        }
        
    }

    const onDiscountCodeKeyDown: KeyboardEventHandler<HTMLInputElement> =  (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleVerifyDiscountCode(event);
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!mentorShipSession?.id) {
            setNetworkResponse({title: "Creating mentorship session", type: "loading"});
            const createMentorshipSessionResponse = await MentorshipSesssionAPI
            .createMentorshipSession({mentee: userProfileLoggedIn!.user,
                 mentor: mentorShipSession.mentor!.id,
                 discountcode_set: discountCode.id ? [discountCode.id]: []});
            const {data: createdSession} = createMentorshipSessionResponse;
            mentorShipSession = createdSession;
        }
        if (mentorShipSession.discountcode_set?.length && mentorShipSession.discountcode_set?.length > 0) {

            mentorShipSession.stripe_payment_intent_id = `discount_${discountCode.id}`;
            onPaymentComplete(mentorShipSession);
            setNetworkResponse({title: "Session created succesfully", type: "success"});
            return
        }
        const billing_details = {
            name: cardHolderName,
            email: cardHolderEmail,
        }
        const paymentData = {
            total_payment_amount: totalPaymentAmount,
            billing_details,
            mentorship_session: {id: mentorShipSession.id}
        };
        setNetworkResponse({title: "Processing payment", type: "loading"});
        try{
            const {data: clientSecretData} = await PaymentAPI.getClientSecretMentorshipSession(paymentData);
            try {
                const cardPaymentResult = await stripe!.confirmCardPayment(clientSecretData.client_secret, {
                    payment_method: {
                        card: cardElementRef && (cardElementRef.current as any)._element,
                        billing_details,
                    },
                });

                if (cardPaymentResult.error) {
                    setNetworkResponse({title: getErrorMessage(cardPaymentResult.error), type: "loading"});
                    // Show error to your customer (e.g., insufficient funds)
                    // let isResponseErrorMessage = cardPaymentResult.error.message;
                    // if (cardPaymentResult.error.message?.includes("postal code is incomplete")) {
                    //     isResponseErrorMessage += "\nHint: If you can't see the field to enter your postal code," +
                    //         " try selecting your expiry date."
                    // }
                } else if (cardPaymentResult.paymentIntent) {
                    // The payment has been processed!
                    if (cardPaymentResult.paymentIntent.status === 'succeeded') {
                        
                        mentorShipSession.stripe_payment_intent_id = cardPaymentResult.paymentIntent.id;
                        onPaymentComplete(mentorShipSession);
                        setNetworkResponse({title: "Payment completed succesfully", type: "success"});
                    }
                }

            } catch (confirmCardPaymentError) {
                console.log({confirmCardPaymentError});
                setNetworkResponse({title: getErrorMessage(confirmCardPaymentError), type: "error"});
                console.log("getErrorMessage(confirmCardPaymentError)", getErrorMessage(confirmCardPaymentError));
            }

        } catch (getClientSecretError) {
            console.log({getClientSecretError});
            setNetworkResponse({title: getErrorMessage(getClientSecretError), type: "error"});
            console.log("getErrorMessage(getClientSecretError)", getErrorMessage(getClientSecretError));

        }
        
    }


    return (
        <div className='MentorshipSessionPaymentForm container'>
            <Row gutter={16}>

                <Col sm={24} md={12}>
                    <Row gutter={16}>

                        <Col span={24} className="mb-3">
                            <input placeholder="Cardholder Name"
                                    name="cardHolderName"
                                    className="form-control"
                                    value={cardHolderName}
                                    onChange={event => (setCardHolderName(event.target.value))}
                            />
                        </Col>

                        <Col span={24} className="mb-3">
                            <input placeholder="Cardholder Email"
                                    name="cardHolderEmail"
                                    className="form-control"
                                    value={cardHolderEmail}
                                    onChange={event => (setCardHolderEmail(event.target.value))}
                            />
                        </Col>
                    
                        <Col span={24} className="mb-3">

                            <div id="card-element">

                            </div>

                            <CardElement style={{base: {fontSize: '18px'}}} ref={cardElementRef} />

                            {Environment.name !== "prod" &&
                            <p className="my-3">
                                Test with: 4000001240000000
                            </p>
                            }


                        <Col span={24} className="mb-3">
                            <input placeholder="Optional: Mentorship Scholarship Code"
                                    name="discountCode"
                                    className="form-control"
                                    value={discountCode.code}
                                    onKeyDown={onDiscountCodeKeyDown}
                                    onChange={event => (setDiscountCode(prevDiscountCode => ({...prevDiscountCode, code: event.target.value})))}
                            />
                        </Col>


                        <Button className="col-12 my-3"
                                    size="large"
                                    style={{height: "auto"}}
                                    disabled={!discountCode.code||networkResponse.type==="loading"}
                                    onClick={handleVerifyDiscountCode}>
                            Verify Mentorship Scholarship Code
                        </Button>

                            <Button className="col-12 my-3"
                                    type="primary"
                                    size="large"
                                    style={{height: "auto"}}
                                    disabled={networkResponse.type==="loading"}
                                    onClick={handleSubmit}>
                                        {/* If there is a discountCode, don't show create Session */}
                                Create Session {discountCode.id ? '' : formatCurrency(totalPaymentAmount)}
                            </Button>


                            <NetworkResponseDisplay response={networkResponse} />

                        </Col>
                    </Row>
                </Col>

                <Col sm={24} md={12}>
                    <MentorshipSessionInvoice session={{...session, discountcode_set: discountCode.id ? [discountCode.id]: []}} />
                </Col>

            </Row>


        </div>
    )
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

const mapDispatchToProps = {}

export default injectStripe(connect(mapStateToProps, mapDispatchToProps)(MentorshipSessionPaymentForm));
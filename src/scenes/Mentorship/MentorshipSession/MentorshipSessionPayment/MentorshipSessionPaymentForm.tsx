import React, { FormEvent, useRef, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { connect } from 'react-redux';
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import { ATILA_SCHOLARSHIP_FEE_TAX } from '../../../../models/ConstantsPayments';
import { MentorshipSession } from '../../../../models/MentorshipSession';
import { UserProfile } from '../../../../models/UserProfile.class';
import MentorshipSesssionAPI from '../../../../services/Mentorship/MentorshipSessionAPI';
import { formatCurrency, getErrorMessage } from '../../../../services/utils';
import Environment from '../../../../services/Environment';
import MentorshipSessionInvoice from './MentorshipSessionInvoice';
import PaymentAPI from '../../../../services/PaymentAPI';

interface MentorshipSessionPaymentFormProps extends ReactStripeElements.InjectedStripeProps {
    session: MentorshipSession,
    onPaymentComplete: (paymentDetails: any) => void,
    userProfileLoggedIn?: UserProfile,
}

function MentorshipSessionPaymentForm(props: MentorshipSessionPaymentFormProps) {

    const { session, userProfileLoggedIn, stripe, onPaymentComplete } = props;
    const cardElementRef = useRef(null);
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardHolderEmail, setCardHolderEmail] = useState("");
    if (!session?.mentor) {
        return null
    }

    const mentorshipTax =  Number.parseFloat(session.mentor.price) * ATILA_SCHOLARSHIP_FEE_TAX;
    const totalPaymentAmount =  Number.parseFloat(session.mentor.price) + mentorshipTax;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!session?.id) {
            const createMentorshipSessionResponse = await MentorshipSesssionAPI
            .createMentorshipSession({mentee: userProfileLoggedIn!.user, mentor: session.mentor!.id});
            const {data: createdSession} = createMentorshipSessionResponse;
            session.id = createdSession.id;
        }
        const billing_details = {
            name: cardHolderName,
            email: cardHolderEmail,
        }
        const paymentData = {
            total_payment_amount: totalPaymentAmount,
            billing_details,
            mentorship_session: {id: session.id}
        };
        console.log('cardElementRef.current', cardElementRef.current);
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
                    // Show error to your customer (e.g., insufficient funds)
                    // let isResponseErrorMessage = cardPaymentResult.error.message;
                    // if (cardPaymentResult.error.message?.includes("postal code is incomplete")) {
                    //     isResponseErrorMessage += "\nHint: If you can't see the field to enter your postal code," +
                    //         " try selecting your expiry date."
                    // }
                } else if (cardPaymentResult.paymentIntent) {
                    // The payment has been processed!
                    if (cardPaymentResult.paymentIntent.status === 'succeeded') {
                        
                        session.stripe_payment_intent_id = cardPaymentResult.paymentIntent.id;
                        onPaymentComplete({stripe_payment_intent_id: cardPaymentResult.paymentIntent.id, id: session.id})
                    }
                }

            } catch (confirmCardPaymentError) {
                console.log({confirmCardPaymentError});
                console.log("getErrorMessage(confirmCardPaymentError)", getErrorMessage(confirmCardPaymentError));
            }

        } catch (getClientSecretError) {
            console.log({getClientSecretError});
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
                            <Button className="col-12 my-3"
                                    type="primary"
                                    size="large"
                                    style={{height: "auto"}}
                                    onClick={handleSubmit}>
                                Create Session {formatCurrency(totalPaymentAmount)}
                            </Button>

                        </Col>
                    </Row>
                </Col>

                <Col sm={24} md={12}>
                    <MentorshipSessionInvoice session={session} />
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
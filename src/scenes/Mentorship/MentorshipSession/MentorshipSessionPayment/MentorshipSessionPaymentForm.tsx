import React, { FormEvent, useRef } from 'react';
import { Button, Col, Row } from 'antd';
import { connect } from 'react-redux';
import {CardElement} from 'react-stripe-elements';
import { ATILA_SCHOLARSHIP_FEE_TAX } from '../../../../models/ConstantsPayments';
import { MentorshipSession } from '../../../../models/MentorshipSession';
import { UserProfile } from '../../../../models/UserProfile.class';
import MentorshipSesssionAPI from '../../../../services/Mentorship/MentorshipSessionAPI';
import { formatCurrency } from '../../../../services/utils';
import Environment from '../../../../services/Environment';
import MentorshipSessionInvoice from './MentorshipSessionInvoice';

interface MentorshipSessionPaymentFormProps {
    session: MentorshipSession,
    onPaymentComplete?: (paymentDetails: any) => void,
    userProfileLoggedIn?: UserProfile,
}

function MentorshipSessionPaymentForm(props: MentorshipSessionPaymentFormProps) {

    const { session, userProfileLoggedIn } = props;
    const cardElementRef = useRef(null);
    console.log({session});

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!session?.id) {
            const createSessionResponse = await MentorshipSesssionAPI
            .createMentorshipSession({mentee: userProfileLoggedIn!.user, mentor: session.mentor!.id});
            console.log({createSessionResponse});
        }
        
    }

    if (!session?.mentor) {
        return null
    }

    const mentorshipTax =  Number.parseFloat(session.mentor.price) * ATILA_SCHOLARSHIP_FEE_TAX;
    const totalmentorshipCost =  Number.parseFloat(session.mentor.price) + mentorshipTax;

    return (
        <div className='MentorshipSessionPaymentForm container'>
            <Row gutter={16}>

                <Col sm={24} md={12}>
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
                        Create Session {formatCurrency(totalmentorshipCost)}
                    </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(MentorshipSessionPaymentForm);
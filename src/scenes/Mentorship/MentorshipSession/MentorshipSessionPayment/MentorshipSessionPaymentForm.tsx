import React, { FormEvent } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import {CardElement} from 'react-stripe-elements';
import { ATILA_SCHOLARSHIP_FEE_TAX } from '../../../../models/ConstantsPayments';
import { MentorshipSession } from '../../../../models/MentorshipSession';
import { UserProfile } from '../../../../models/UserProfile.class';
import MentorshipSesssionAPI from '../../../../services/Mentorship/MentorshipSessionAPI';
import { formatCurrency } from '../../../../services/utils';

interface MentorshipSessionPaymentFormProps {
    session: MentorshipSession,
    onPaymentComplete?: (paymentDetails: any) => void,
    userProfileLoggedIn?: UserProfile,
}

function MentorshipSessionPaymentForm(props: MentorshipSessionPaymentFormProps) {

    const { session, userProfileLoggedIn } = props;
    console.log({session});

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        MentorshipSesssionAPI
        .createMentorshipSession({mentee: userProfileLoggedIn!.user, mentor: session.mentor!.id})
    }

    if (!session?.mentor) {
        return null
    }

    const mentorshipTax =  Number.parseFloat(session.mentor.price) * ATILA_SCHOLARSHIP_FEE_TAX;
    const totalmentorshipCost =  Number.parseFloat(session.mentor.price) + mentorshipTax;

    return (
        <div>
            <form onSubmit={onSubmit}>
                <CardElement />
            </form>
            <div>




            <table>
                <tr>
                    <td>Mentorship Price</td>
                    <td>{formatCurrency(Number.parseFloat(session.mentor.price))}</td>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td>{formatCurrency(mentorshipTax)}</td>
                </tr>
                <tr>
                    <td>Total Cost</td>
                    <td>{formatCurrency(totalmentorshipCost)}</td>
                </tr>
            </table>
            <Button onClick={onSubmit}>
                Create Session {formatCurrency(totalmentorshipCost)}
            </Button>
            </div>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MentorshipSessionPaymentForm);
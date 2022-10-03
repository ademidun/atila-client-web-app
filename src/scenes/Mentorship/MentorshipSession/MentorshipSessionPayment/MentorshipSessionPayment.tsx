import React from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements';
import { MentorshipSession } from '../../../../models/MentorshipSession';
import Environment from '../../../../services/Environment';
import MentorshipSessionPaymentForm from './MentorshipSessionPaymentForm';

const { STRIPE_PUBLIC_KEY } = Environment;
interface MentorshipSessionPaymentFormProps {
  session: MentorshipSession,
  onPaymentComplete: (session: MentorshipSession) => void,
}

function MentorshipSessionPayment(props: MentorshipSessionPaymentFormProps) {

  const { session, onPaymentComplete } = props;

  return (
    <div className='MentorshipSessionPayment'>
      <StripeProvider apiKey={STRIPE_PUBLIC_KEY} >

      <Elements>
          <MentorshipSessionPaymentForm session={session} stripe={null} elements={null} onPaymentComplete={onPaymentComplete}  />
      </Elements>
      </StripeProvider>
    </div>
  )
}

export default MentorshipSessionPayment
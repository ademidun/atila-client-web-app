import React from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements';
import { MentorshipSession } from '../../../../models/MentorshipSession';
import Environment from '../../../../services/Environment';
import MentorshipSessionPaymentForm from './MentorshipSessionPaymentForm';

const { STRIPE_PUBLIC_KEY } = Environment;
interface MentorshipSessionPaymentFormProps {
  session: MentorshipSession,
}

function MentorshipSessionPayment(props: MentorshipSessionPaymentFormProps) {

  const { session } = props;

  return (
    <div>
      <StripeProvider apiKey={STRIPE_PUBLIC_KEY} >

      <Elements>
          <MentorshipSessionPaymentForm session={session} />
      </Elements>
      </StripeProvider>
    </div>
  )
}

export default MentorshipSessionPayment
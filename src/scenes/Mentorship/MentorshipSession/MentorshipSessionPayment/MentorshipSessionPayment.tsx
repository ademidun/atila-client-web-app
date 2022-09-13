import React from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements';
import Environment from '../../../../services/Environment';
import MentorshipSessionPaymentForm from './MentorshipSessionPaymentForm';

const { STRIPE_PUBLIC_KEY } = Environment;
function MentorshipSessionPayment() {
  return (
    <div>
      <StripeProvider apiKey={STRIPE_PUBLIC_KEY} >

      <Elements>
          <MentorshipSessionPaymentForm />
      </Elements>
      </StripeProvider>
    </div>
  )
}

export default MentorshipSessionPayment
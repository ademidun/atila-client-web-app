import React from 'react'
import {CardElement} from 'react-stripe-elements';

function MentorshipSessionPaymentForm() {
  return (
    <div>
        <form>
            <CardElement />
            <button>Submit</button>
        </form>
    </div>
  )
}

export default MentorshipSessionPaymentForm
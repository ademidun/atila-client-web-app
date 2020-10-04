import React from "react";
import {Elements, StripeProvider} from "react-stripe-elements";
import PremiumCheckoutForm from "./PaymentSendForm";
import Environment from "../../../services/Environment";

const { STRIPE_PUBLIC_KEY } = Environment;
class PaymentSend extends React.Component {

    render() {
        return (
            // ...
            <StripeProvider
                apiKey={STRIPE_PUBLIC_KEY}
            >

                <Elements>
                    <PremiumCheckoutForm />
                </Elements>
            </StripeProvider>
        )
    }
}

export default PaymentSend;
import React from "react";
import {Elements, StripeProvider} from "react-stripe-elements";
import {STRIPE_PUBLIC_KEY} from "../../models/Constants";
import PremiumCheckoutForm from "./PremiumCheckoutForm";

class Premium extends React.Component {

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

export default Premium;
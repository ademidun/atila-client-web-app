// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Button} from "antd";
import {withRouter} from "react-router-dom";
import {STRIPE_PUBLIC_KEY} from "../../models/Constants";


class PremiumCheckoutForm extends React.Component {
    handleSubmit = (ev) => {
        // We don't want to let default form submission happen here, which would refresh the page.
        ev.preventDefault();

        const data = {};

        // Within the context of `Elements`, this call to createPaymentMethod knows from which Element to
        // create the PaymentMethod, since there's only one in this group.
        // See our createPaymentMethod documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method
        console.log({ev});

        this.props.stripe
            .createToken({type: 'card', name: 'Jenny Rosen'})
            .then(function(result) {
                console.log({result})
            });
        this.props.stripe
            .createPaymentMethod('card', {billing_details: {name: 'Jenny Rosen'}})
            .then(({paymentMethod}) => {
                console.log('Received Stripe PaymentMethod:', paymentMethod);
            });

        // You can also use handleCardPayment with the PaymentIntents API automatic confirmation flow.
        // See our handleCardPayment documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-payment
        this.props.stripe.handleCardPayment(STRIPE_PUBLIC_KEY, data);

        // You can also use handleCardSetup with the SetupIntents API.
        // See our handleCardSetup documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-setup
        this.props.stripe.handleCardSetup(STRIPE_PUBLIC_KEY, data);

        // You can also use createToken to create tokens.
        // See our tokens documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-create-token
        // token type can optionally be inferred if there is only one Element
        // with which to create tokens
        // this.props.stripe.createToken({name: 'Jenny Rosen'});

        // You can also use createSource to create Sources.
        // See our Sources documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-create-source
        this.props.stripe.createSource({
            type: 'card',
            owner: {
                name: 'Jenny Rosen',
            },
        });
    };

    render() {
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>Student Premium Checkout</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <CardElement style={{base: {fontSize: '18px'}}} />
                        </div>

                        <Button className="col-12 my-3"
                                type="primary"
                        onClick={this.handleSubmit}>
                            Confirm order
                        </Button>

                    </form>
                </div>
            </div>
        );
    }
}

export default injectStripe(withRouter(PremiumCheckoutForm));
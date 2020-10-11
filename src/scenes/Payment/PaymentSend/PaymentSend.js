import React from "react";
import PropTypes from "prop-types";
import {Elements, StripeProvider} from "react-stripe-elements";
import PaymentSendForm from "./PaymentSendForm";
import Environment from "../../../services/Environment";
import {ScholarshipPropType} from "../../../models/Scholarship";

const { STRIPE_PUBLIC_KEY } = Environment;
class PaymentSend extends React.Component {

    render() {

        const { scholarship, updateScholarship } = this.props;

        return (
            // ...
            <StripeProvider
                apiKey={STRIPE_PUBLIC_KEY}
            >

                <Elements>
                    <PaymentSendForm scholarship={scholarship} updateScholarship={updateScholarship} />
                </Elements>
            </StripeProvider>
        )
    }
}

PaymentSend.propTypes = {
    updateScholarship: PropTypes.func,
    scholarship: ScholarshipPropType,
};

export default PaymentSend;
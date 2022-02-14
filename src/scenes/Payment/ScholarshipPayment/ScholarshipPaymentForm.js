import React from "react";
import PropTypes from "prop-types";
import {Elements, StripeProvider} from "react-stripe-elements";
import PaymentSendForm from "./ScholarshipPaymentFormCreditCard";
import Environment from "../../../services/Environment";
import {ScholarshipPropType} from "../../../models/Scholarship";
import {Currencies} from "../../../models/ConstantsPayments";
import ScholarshipCryptoPaymentForm from "../../Scholarship/ScholarshipCryptoPaymentForm";

const { STRIPE_PUBLIC_KEY } = Environment;
class PaymentSend extends React.Component {

    render() {

        const { scholarship, onFundingComplete, contributor, contributorFundingAmount, awards } = this.props;
        const { currency } = contributor

        if (Currencies[currency].is_crypto) {
            return (
                <ScholarshipCryptoPaymentForm scholarship={scholarship} awards={awards} contributor={contributor} />
            )
        }

        return (
            // ...
            <StripeProvider
                apiKey={STRIPE_PUBLIC_KEY}
            >

                <Elements>
                    <PaymentSendForm scholarship={scholarship}
                                     onFundingComplete={onFundingComplete}
                                     contributor={contributor}
                                     contributorFundingAmount={contributorFundingAmount} />
                </Elements>
            </StripeProvider>
        )
    }
}

PaymentSend.propTypes = {
    onFundingComplete: PropTypes.func,
    scholarship: ScholarshipPropType,
    awards: PropTypes.arrayOf({}),
    contributor: PropTypes.shape({}),
    contributorFundingAmount: PropTypes.number,
};

export default PaymentSend;
import React from "react";
import PropTypes from "prop-types";
import {Elements, StripeProvider} from "react-stripe-elements";
import ScholarshipPaymentFormCreditCard from "./ScholarshipPaymentFormCreditCard";
import Environment from "../../../services/Environment";
import {ScholarshipPropType} from "../../../models/Scholarship";
import {Currencies} from "../../../models/ConstantsPayments";
import ScholarshipPaymentFormCrypto from "./ScholarshipPaymentFormCrypto";

const { STRIPE_PUBLIC_KEY } = Environment;
class ScholarshipPaymentForm extends React.Component {

    render() {

        const { scholarship, onFundingComplete, contributor, contributorFundingAmount, awards } = this.props;
        const { currency } = contributor

        if (Currencies[currency].is_crypto) {
            return (
                <ScholarshipPaymentFormCrypto scholarship={scholarship} awards={awards} contributor={contributor} onFundingComplete={onFundingComplete} />
            )
        }

        return (
            // ...
            <StripeProvider
                apiKey={STRIPE_PUBLIC_KEY}
            >

                <Elements>
                    <ScholarshipPaymentFormCreditCard scholarship={scholarship}
                                     onFundingComplete={onFundingComplete}
                                     contributor={contributor}
                                     contributorFundingAmount={contributorFundingAmount} />
                </Elements>
            </StripeProvider>
        )
    }
}

ScholarshipPaymentForm.propTypes = {
    // onFundingComplete Takes a contribution object
    // TODO make this into a typescript file so we can specify the function type
    onFundingComplete: PropTypes.func,
    scholarship: ScholarshipPropType,
    awards: PropTypes.arrayOf({}),
    contributor: PropTypes.shape({}),
    contributorFundingAmount: PropTypes.number,
};

export default ScholarshipPaymentForm;
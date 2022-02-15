import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../../models/UserProfile";
import moment from "moment";
import {ScholarshipPropType} from "../../../models/Scholarship";
import {formatCurrency} from "../../../services/utils";
import './Invoice.scss'
import {ATILA_SCHOLARSHIP_FEE, ATILA_SCHOLARSHIP_FEE_TAX, Currencies} from "../../../models/ConstantsPayments";
import CurrencyDisplay from "@atila/web-components-library.ui.currency-display";

// source: https://github.com/sparksuite/simple-html-invoice-template
const logoImageData = "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-logo-right-way-circle-transparent.png?alt=media&token=c7b77a1a-9563-41ef-90e9-57025a7dbd87";
function Invoice({ contributor, scholarship, contributorFundingAmount, cardHolderName }) {

    const { email, currency } = contributor;

    // For crypto scholarships don't cast to int because the decimal places are important.
    const isCrypto = Currencies[currency].is_crypto;
    const fundingAmount = isCrypto ? Number.parseFloat(contributorFundingAmount) : Number.parseInt(contributorFundingAmount);
    const decimalPlaces = isCrypto ? 4 : 2;
    const atilaFee = contributorFundingAmount * ATILA_SCHOLARSHIP_FEE;
    const atilaFeeTax = atilaFee * ATILA_SCHOLARSHIP_FEE_TAX;
    let totalAmount = fundingAmount + atilaFee;

    if (!isCrypto) {
        totalAmount += atilaFeeTax;
    }



    const todayString = moment(Date.now()).format('MMMM DD, YYYY');
    return (
        <div className="Invoice card shadow p-3">
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                <tr className="top">
                    <td colSpan="2">
                        <table>
                            <tbody>
                            <tr>
                                <td className="title">
                                    <img src={logoImageData}
                                         style={{maxHeight:'75px'}} alt="atila logo" />
                                </td>
                                <td>
                                    {todayString}<br />
                                    Atila Tech.<br />
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr className="information">
                    <td colSpan="2">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    {cardHolderName}<br />
                                    {email}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr className="heading">
                    <td>
                        Item
                    </td>

                    <td>
                        Price
                    </td>
                </tr>

                <tr className="item">
                    <td>
                        {scholarship.name}
                    </td>

                    <td>
                        {formatCurrency(fundingAmount, false, decimalPlaces, currency)}
                    </td>
                </tr>

                <tr className="item">
                    <td>
                        Atila Fee ({Number.parseInt(ATILA_SCHOLARSHIP_FEE * 100)}%)
                    </td>

                    <td>
                        {formatCurrency(atilaFee, false, decimalPlaces, currency)}
                    </td>
                </tr>

                {!isCrypto && 
                <tr className="item">
                    <td>
                        Atila Fee HST (13%)
                    </td>

                    <td>
                        {formatCurrency(atilaFeeTax, false, decimalPlaces, currency)}
                    </td>
                </tr>
                }

                <tr className="item total">
                    <td>
                        Total
                    </td>
                    <td>
                        {formatCurrency(totalAmount, false, decimalPlaces, currency)}
                        
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="my-3 p-1">
                <small>
                    Currency: {Currencies[currency].name}
                    {Currencies[currency].is_crypto &&
                        <>
                        <br/>
                        <CurrencyDisplay amount={totalAmount} inputCurrency={currency} />
                        </>
                    }    
                </small>
            </div>
        </div>
    )
}

Invoice.defaultProps = {
    contributor: null,
};
Invoice.propTypes = {
    scholarship: ScholarshipPropType,
    contributorFundingAmount: PropTypes.number,
    contributor: PropTypes.shape({}),
    cardHolderName: PropTypes.string,
    // redux
    userProfile: UserProfilePropType
};

const mapStateToProps = state => {
    return {
        userProfile: state.data.user.loggedInUserProfile,
    };
};

export default connect(mapStateToProps)(Invoice);
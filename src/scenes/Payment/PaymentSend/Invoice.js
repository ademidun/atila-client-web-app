import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../../models/UserProfile";
import moment from "moment";
import {ScholarshipPropType} from "../../../models/Scholarship";
import {formatCurrency} from "../../../services/utils";
import './Invoice.scss'
import {ATILA_SCHOLARSHIP_FEE, ATILA_SCHOLARSHIP_FEE_TAX} from "../../../models/ConstantsPayments";

// source: https://github.com/sparksuite/simple-html-invoice-template
const logoImageData = "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-logo-right-way-circle-transparent.png?alt=media&token=c7b77a1a-9563-41ef-90e9-57025a7dbd87";
function Invoice({ contributor, scholarship, contributorFundingAmount, cardHolderName }) {

    const { email } = contributor;

    const fundingAmount = Number.parseInt(contributorFundingAmount);
    const atilaFee = contributorFundingAmount * ATILA_SCHOLARSHIP_FEE;
    const atilaFeeTax = atilaFee * ATILA_SCHOLARSHIP_FEE_TAX;
    const totalAmount = fundingAmount + atilaFee + atilaFeeTax;



    const todayString = moment(Date.now()).format('MMMM DD, YYYY');
    return (
        <div className="invoice-box px-3">
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
                        {formatCurrency(fundingAmount)}
                    </td>
                </tr>

                <tr className="item">
                    <td>
                        Atila Fee ({Number.parseInt(ATILA_SCHOLARSHIP_FEE * 100)}%)
                    </td>

                    <td>
                        {formatCurrency(atilaFee)}
                    </td>
                </tr>

                <tr className="item">
                    <td>
                        Atila Fee HST (13%)
                    </td>

                    <td>
                        {formatCurrency(atilaFeeTax)}
                    </td>
                </tr>

                <tr className="item total">
                    <td>
                        Total
                    </td>
                    <td>
                        {formatCurrency(totalAmount)}
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="my-3 p-1">
                <small>Currency: Canadian Dollar (CAD)</small>
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
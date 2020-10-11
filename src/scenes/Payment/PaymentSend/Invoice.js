import React from "react";
import './Invoice.scss'
import {connect} from "react-redux";
import {UserProfilePropType} from "../../../models/UserProfile";
import moment from "moment";
import {ScholarshipPropType} from "../../../models/Scholarship";
import {ATILA_SCHOLARSHIP_FEE, ATILA_SCHOLARSHIP_FEE_TAX} from "../../../models/Constants";
import {formatCurrency} from "../../../services/utils";

// source: https://github.com/sparksuite/simple-html-invoice-template
const logoImageData = "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-logo-right-way-circle-transparent.png?alt=media&token=c7b77a1a-9563-41ef-90e9-57025a7dbd87";
function Invoice({ userProfile, scholarship }) {

    const { first_name, last_name, email } = userProfile;
    const { funding_amount } = scholarship;

    const fundingAmount = Number.parseInt(funding_amount);
    const atilaFee = funding_amount * ATILA_SCHOLARSHIP_FEE;
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
                                    {first_name} {last_name}<br />
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
        </div>
    )
}

Invoice.defaultProps = {
    userProfile: null
};
Invoice.propTypes = {
    scholarship: ScholarshipPropType,
    // redux
    userProfile: UserProfilePropType
};

const mapStateToProps = state => {
    return {
        userProfile: state.data.user.loggedInUserProfile,
    };
};

export default connect(mapStateToProps)(Invoice);
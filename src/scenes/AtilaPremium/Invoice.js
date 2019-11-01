import React from "react";
import './Invoice.scss'
import {connect} from "react-redux";
import {UserProfilePropType} from "../../models/UserProfile";
import moment from "moment";
import {PREMIUM_PRICE_BEFORE_TAX, PREMIUM_PRICE_WITH_TAX} from "./PremiumCheckoutForm";

// source: https://github.com/sparksuite/simple-html-invoice-template
const logoImageData = "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-logo-right-way-circle-transparent.png?alt=media&token=c7b77a1a-9563-41ef-90e9-57025a7dbd87";
function Invoice({ userProfile }) {

    const { first_name, last_name, email } = userProfile;
    const todayString = moment(Date.now()).format('MMMM DD, YYYY');
    return (
        <div className="invoice-box">
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
                                    Date: {todayString}<br />
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
                                    Atila Tech.<br />
                                </td>

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
                        Atila Student Premium
                    </td>

                    <td>
                        ${PREMIUM_PRICE_BEFORE_TAX}
                    </td>
                </tr>

                <tr className="item">
                    <td>
                        HST (13%)
                    </td>

                    <td>
                        $1.17
                    </td>
                </tr>

                <tr className="item total">
                    <td>
                        Total
                    </td>
                    <td>
                        ${PREMIUM_PRICE_WITH_TAX}
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
    userProfile: UserProfilePropType
};

const mapStateToProps = state => {
    return {
        userProfile: state.data.user.loggedInUserProfile,
    };
};

export default connect(mapStateToProps)(Invoice);
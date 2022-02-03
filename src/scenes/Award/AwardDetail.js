import React from "react";
import {AwardGeneral} from "../../models/Award";
import PropTypes from "prop-types";
import CurrencyDisplay from "@atila/web-components-library.ui.currency-display";

// Could be a functional component but decided to keep it class just in case.
class AwardDetail extends React.Component {
    render() {
        const { awards } = this.props;

        const renderAwards = awards.map((award, index) =>
            (
                <tr key={index}>
                <th scope="row">{index+1}</th>
                <td><CurrencyDisplay amount={award.funding_amount} inputCurrency={award.currency||"CAD"} outputCurrency="USD" /></td>
                </tr>
            )
        )

        return (
            <div className="AwardDetail">

                <table class="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">Award</th>
                    <th scope="col">Funding Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {renderAwards}
                </tbody>
                </table>
                
            </div>
        )
    }

}

AwardDetail.defaultProps = {
    awards: [AwardGeneral],
}

AwardDetail.propTypes = {
    awards: PropTypes.array.isRequired,
}

export default AwardDetail;
import React from "react";
import CurrencyDisplay from "@atila/web-components-library.ui.currency-display";
import { Award } from "../../models/Award";

interface AwardDetailPropTypes {
    awards: Array<Award>;
}


function AwardDetail(props: AwardDetailPropTypes){
    const { awards } = props;

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

            <table className="table table-striped">
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

export default AwardDetail;
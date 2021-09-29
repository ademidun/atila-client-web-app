import React from "react";
import {AwardGeneral} from "../../models/Award";
import {formatCurrency} from "../../services/utils";
import PropTypes from "prop-types";

// Could be a functional component but decided to keep it class just in case.
class AwardDetail extends React.Component {
    render() {
        const { awards } = this.props;

        const renderAwards = awards.map((award, index) =>
            (
                <div key={index}>
                    Award {index+1}: {formatCurrency(Number.parseInt(award.funding_amount), true)}
                </div>
            )
        )

        return (
            <div>
                {renderAwards}
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
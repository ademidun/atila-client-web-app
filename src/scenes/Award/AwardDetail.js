import React from "react";
import {AwardGeneral, AwardPropType} from "../../models/Award";


class AwardDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { award } = this.props;

        return (
            <div>

            </div>
        )
    }

}

AwardDetail.defaultProps = {
    award: AwardGeneral,
}

AwardDetail.propTypes = {
    award: AwardPropType.isRequired,
}

export default AwardDetail;
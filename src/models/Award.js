import PropTypes from "prop-types";
import {ScholarshipPropType} from "./Scholarship";

export const AwardPropType = PropTypes.shape({
    funding_amount: PropTypes.string.isRequired,
    scholarship: ScholarshipPropType,
    recipient: PropTypes.object, // Application Object
});

export const AwardGeneral = {
    funding_amount: "1000",
}
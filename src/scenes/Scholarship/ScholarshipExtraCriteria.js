import React from "react";
import {prettifyKeys} from "../../services/utils";
import PropTypes from "prop-types";
import {connect} from "react-redux";

function ScholarshipExtraCriteria({scholarship, userProfile}) {

    return (
        <div className="other-criteria">
            <h5>Other Criteria</h5>
            {AUTOCOMPLETE_KEY_LIST.map(key => (
                <React.Fragment>
                    <p>
                        <strong>{prettifyKeys(key)} {key === 'citizenship' ? 'or permanent residency': ''}:</strong>
                        {scholarship[key]}
                    </p>
                    {userProfile &&
                    <p>
                        Your {prettifyKeys(key)}: JSON.stringify(userProfile[key])
                    </p>
                    }
                    {
                        userProfile && userProfile[key] && userProfile[key].length===0} &&

                    }
                    {['city', 'province', 'country'].map(locationType => (
                        <React.Fragment>
                            {scholarship[locationType].map(locationString => (
                                locationString.name
                            ))}
                        </React.Fragment>
                    ))}

                    {scholarship.female_only && <p><strong>Female Only</strong></p>}
                    {scholarship.international_students_eligible && <p><strong>International Students Eligible</strong></p>}
                </React.Fragment>
            ))}
        </div>
    )
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

ScholarshipExtraCriteria.defaultProps = {
    userProfile: null,
};

ScholarshipExtraCriteria.propTypes = {
    userProfile: PropTypes.shape({}),
    scholarship: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps)(ScholarshipExtraCriteria);
import React from "react";
import {prettifyKeys} from "../../services/utils";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {AUTOCOMPLETE_KEY_LIST} from "../../models/ConstantsForm";
import {Link} from "react-router-dom";

function ScholarshipExtraCriteria({scholarship, userProfile}) {

    if (!AUTOCOMPLETE_KEY_LIST.some(key => (scholarship[key] && scholarship[key].length>0))) {
        return null;
    }

    return (
        <div className="other-criteria">
            <h3>Other Criteria</h3>
            {AUTOCOMPLETE_KEY_LIST
                .filter(key=>(scholarship[key] && scholarship[key].length>0))
                .map(key => (
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
                        userProfile && userProfile[key] && userProfile[key].length===0 &&
                        <p>
                            Don't qualify for scholarships of these {prettifyKeys(key)}?
                            <Link to={`/profile/${userProfile.username}/edit`}>
                                Edit Profile</Link> to see correct scholarships
                        </p>
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
import React from "react";
import {prettifyKeys} from "../../services/utils";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {AUTOCOMPLETE_KEY_LIST} from "../../models/ConstantsForm";
import {Link} from "react-router-dom";
import {emojiDictionary} from "../../models/Constants";

function ScholarshipExtraCriteria({scholarship, userProfile}) {

    if (!AUTOCOMPLETE_KEY_LIST.some(key => (scholarship[key] && scholarship[key].length>0)) &&
        !['city', 'province', 'country'].some(key => (scholarship[key] && scholarship[key].length>0))
    ) {
        return null;
    }

    return (
        <div className="other-criteria">
            <h3>Other Criteria</h3>
            {AUTOCOMPLETE_KEY_LIST
                .filter(criteria=>(scholarship[criteria] && scholarship[criteria].length>0))
                .map(criteria => (
                <React.Fragment key={criteria}>
                    <p>
                        <strong>{prettifyKeys(criteria)} {criteria === 'citizenship' ? 'or permanent residency': ''}:</strong>
                        {JSON.stringify(scholarship[criteria], null, ' ')}
                    </p>
                    {userProfile &&
                    <p>
                        <strong>Your {prettifyKeys(criteria)}:{' '}</strong>
                        {JSON.stringify(userProfile[criteria], null, ' ')}
                    </p>
                    }
                    {
                        userProfile && userProfile[criteria] && userProfile[criteria].length===0 &&
                        <p>
                            Don't qualify for scholarships of these {prettifyKeys(criteria)}?
                            <Link to={`/profile/${userProfile.username}/edit`}>
                                Edit Profile</Link> to see correct scholarships
                        </p>
                    }
                </React.Fragment>
            ))}
            {['city', 'province', 'country'].map(locationType => (
                <React.Fragment key={locationType}>

                    {scholarship[locationType].map((locationString, index) => (
                        <React.Fragment key={locationString}>
                            {index===0 && <strong>{prettifyKeys(locationType)}: {' '}</strong>}
                            {' '}
                            {locationString.name}
                            {emojiDictionary[locationString.name.toLowerCase()]}
                            {index < scholarship[locationType].length-1 ? ', ' : null }
                        </React.Fragment>
                    ))}
                    {scholarship[locationType].length > 0 && <br />}
                </React.Fragment>
            ))}

            {scholarship.female_only && <p><strong>Female Only <span role="img" aria-label="female emoji">
                🙎🏾
            </span>
            </strong></p>}
            {scholarship.international_students_eligible && <p><strong>International Students Eligible
                <span role="img" aria-label="globe emoji">🌏</span>
            </strong></p>}
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
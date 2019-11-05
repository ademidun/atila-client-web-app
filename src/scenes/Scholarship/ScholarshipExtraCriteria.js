import React from "react";
import {prettifyKeys} from "../../services/utils";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {AUTOCOMPLETE_KEY_LIST} from "../../models/ConstantsForm";
import {Link} from "react-router-dom";
import {emojiDictionary} from "../../models/Constants";

export function doesScholarshipHaveExtraCriteria(scholarship) {
    return (AUTOCOMPLETE_KEY_LIST.some(key => (scholarship[key] && scholarship[key].length>0)) ||
        ['city', 'province', 'country'].some(key => (scholarship[key] && scholarship[key].length>0)
            || scholarship.female_only ||scholarship.international_students_eligible
        ))
}

function ScholarshipExtraCriteria({scholarship, userProfile}) {

    if (!doesScholarshipHaveExtraCriteria(scholarship)) {
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
                        <strong>{prettifyKeys(criteria)}{criteria === 'citizenship' ? ' or permanent residency': ''}:{' '}</strong>
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
                        <p key={locationString}>

                            {index===0 && <strong>{prettifyKeys(locationType)}: {' '}</strong>}
                            {' '}
                            {locationString.name}
                            {emojiDictionary[locationString.name.toLowerCase()]}
                            {index < scholarship[locationType].length-1 ? ', ' : null }
                            <br />
                            {
                                userProfile &&
                                userProfile[locationType] &&
                                userProfile[locationType].length===0
                                &&
                                <p>
                                    Don't qualify for scholarships of these {prettifyKeys(locationType)}?
                                    <Link to={`/profile/${userProfile.username}/edit`}>
                                        Edit Profile</Link> to see correct scholarships
                                </p>
                            }
                        </p>
                    ))}
                    {scholarship[locationType].length > 0 && <br />}
                </React.Fragment>
            ))}

            {scholarship.female_only && <p><strong>Female Only <span role="img" aria-label="female emoji">
                🙎🏾
            </span> {userProfile && userProfile.gender !== 'female' &&
            <span>
                <br />
                Not a Female? <Link to={`/profile/${userProfile.username}/edit`}>
                Edit Profile</Link> to see correct scholarships
            </span>
            }
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
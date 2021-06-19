import React from 'react';
import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {toastNotify} from "../../models/Utils";
import NotificationsService from "../../services/NotificationsService";
import {Link} from "react-router-dom";
import {Tooltip} from "antd";
import {addToMyScholarshipHelper} from "../../models/UserProfile";
import UserProfileAPI from "../../services/UserProfileAPI";
import {handleError} from "../../services/utils";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import {message} from 'antd';

class ScholarshipShareSaveButtons extends React.Component {

    constructor(props) {
        super(props);

        const { userProfile, scholarship } = props;

        let isSavedScholarship = false;
        if (userProfile && userProfile.saved_scholarships && userProfile.saved_scholarships.includes(scholarship.id)) {
            isSavedScholarship = true;
        }

        this.state = {
            isSavedScholarship
        }
    }

    saveScholarship = (event) => {
        event.preventDefault();
        const { isSavedScholarship } = this.state;
        const { userProfile, scholarship, updateLoggedInUserProfile } = this.props;

        if (!userProfile) {
            toastNotify((<p><Link to="/register">Create an Account</Link> to save a scholarship.</p>));
            return;
        }

        if (isSavedScholarship) {
            toastNotify("You've already saved this scholarship 👌🏿");
            return;
        }

        const updatedUserProfile = addToMyScholarshipHelper(userProfile, scholarship);

        this.setState({isSavedScholarship: !isSavedScholarship});
        UserProfileAPI
            .update({userProfile: updatedUserProfile},
                userProfile.user)
            .then(res=>{
                toastNotify('😃 Scholarship successfully saved!');
                updateLoggedInUserProfile(res.data);

                NotificationsService.createScholarshipNotifications(userProfile, scholarship)
                    .then(res=> {
                    })
                    .catch(handleError)
                    .finally(()=> {

                    });
            })
            .catch(handleError);

    };

    notInterestedInScholarship = (event) => {
        event.preventDefault();

        const { userProfile, scholarship, onHideScholarship } = this.props;

        if (!userProfile) {
            toastNotify((<p><Link to="/register">Create an Account</Link> to remove ineligible scholarships.</p>));
            return;
        }
        userProfile.scholarships_not_interested.push(scholarship.id);

        userProfile.metadata['stale_cache'] = true;
        const scholarships_not_interested = userProfile.scholarships_not_interested;
        UserProfileAPI.patch(
            {
                scholarships_not_interested, metadata: userProfile.metadata
            }, userProfile.user)
            .then(res => {
                updateLoggedInUserProfile(res.data);
                const messageText = (<p>
                    Your changes have been saved
                    <span role="img" aria-label="grin emoji">
                        😁
                    </span>
                        . <br/>
                    You will see less scholarships like this.
                </p>);
                message.success(messageText, 5);
                onHideScholarship(event);
            })
            .catch(err=> {
                console.log({err});
            });
    };

    render () {
        const { isSavedScholarship } = this.state;

        return (
            <div className="mb-3 d-inline">
                <Tooltip placement="right"
                         title={isSavedScholarship?
                             "You've already saved this scholarship 👌🏿": 'Save Scholarship'}>
                    <button className={`btn ${isSavedScholarship ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={this.saveScholarship}
                            title={isSavedScholarship?
                                "You've already saved this scholarship 👌🏿": 'Save Scholarship'} >
                        <FontAwesomeIcon className="ml-1" icon={faBookmark}/>
                    </button>
                </Tooltip>
                <Tooltip placement="right"
                         title="Save scholarship and get an email reminder 1 week and 1 day before the deadline.">
                    <FontAwesomeIcon className="ml-1 btn-outline-primary" icon={faQuestionCircle}/>
                </Tooltip>
                <br/>
                <p className="text-muted" style={{"fontSize": "medium"}}>
                <span role="img" className="text-dark" aria-label="backhand index finger pointing up emoji">👆🏿</span>
                    {' '}
                    Save scholarship to get a reminder before the deadline.
                </p>


            </div>
        );
    }
}

ScholarshipShareSaveButtons.defaultProps = {
    userProfile: null,
    onHideScholarship: ()=>{},
};

ScholarshipShareSaveButtons.propTypes = {
    userProfile: PropTypes.shape({}),
    scholarship: PropTypes.shape({}).isRequired,
    onHideScholarship: PropTypes.func
};

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScholarshipShareSaveButtons);
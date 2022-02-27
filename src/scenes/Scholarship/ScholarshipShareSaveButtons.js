import React from 'react';
import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {toastNotify} from "../../models/Utils";
import NotificationsService from "../../services/NotificationsService";
import {Link} from "react-router-dom";
import {addToMyScholarshipHelper} from "../../models/UserProfile";
import UserProfileAPI from "../../services/UserProfileAPI";
import {handleError} from "../../services/utils";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import { Button, message } from 'antd';

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
            toastNotify("You've already saved this scholarship");
            return;
        }

        const updatedUserProfile = addToMyScholarshipHelper(userProfile, scholarship);

        this.setState({isSavedScholarship: !isSavedScholarship});
        UserProfileAPI
            .patch({saved_scholarships_ids: updatedUserProfile.saved_scholarships}, userProfile.user)
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
        const { scholarship } = this.props;

        return (
            <div style={{"fontSize": "18px", minHeight: "75px"}}>
                <Button disabled={isSavedScholarship}
                        className="w-100"
                        style={{"fontSize": "18px", minHeight: "75px", minWidth: "250px"}} //hacky fix to solve the fact that col-md-3 is not working as expected when used inside a card on mobile devices
                        onClick={this.saveScholarship}>
                            {isSavedScholarship ? "You've already saved this scholarship": "Save Scholarship"}
                </Button>
                <br/>
                <p className="text-muted mt-1">
                    Save scholarship to get a reminder before the deadline{' '} {scholarship.is_atila_direct_application && " and when it opens"}.
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
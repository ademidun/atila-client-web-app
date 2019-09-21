import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {onUpdateModelForm} from "../../services/utils";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import FormDynamic from "../../components/Form/FormDynamic";
import {scholarshipUserProfileSharedFormConfigs} from "../../models/Utils";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import UserProfileAPI from "../../services/UserProfileAPI";

class UserProfileEdit extends React.Component {

    updateForm = (event) => {
        event.preventDefault();
        let { userProfile } = this.props;
        const { updateLoggedInUserProfile } = this.props;

        userProfile = onUpdateModelForm(event, userProfile, 'user');
        console.log({userProfile, updateLoggedInUserProfile});
        updateLoggedInUserProfile(userProfile);
    };

    submitForm = (event) => {

        event.preventDefault();
        const { userProfile } = this.props;
        UserProfileAPI
            .update({userProfile, locationData: {}}, userProfile.user)
            .then(res=>{console.log({res})});
    };

    render () {

        const {userProfile} = this.props;

        const userProfileSharedFormConfigs = scholarshipUserProfileSharedFormConfigs
            .map(config => {
                config.className = null;
                return config;
            }).filter(config => config.keyName !== 'criteria_info');
        return (
            <div>
                <h1>Edit Profile</h1>
                <FormDynamic onUpdateForm={this.updateForm}
                             model={userProfile}
                             inputConfigs=
                                 {userProfileSharedFormConfigs}
                />
                <button type="submit"
                        className="btn btn-primary col-12 mt-2"
                        onClick={this.submitForm}>Submit</button>
            </div>
        );
    }
}

const mapDispatchToProps = {
    updateLoggedInUserProfile
};
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

UserProfileEdit.propTypes = {
    // redux
    userProfile: PropTypes.shape({}).isRequired,
    updateLoggedInUserProfile: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit);

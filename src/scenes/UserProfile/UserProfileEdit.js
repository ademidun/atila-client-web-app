import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import FormDynamic from "../../components/Form/FormDynamic";
import {scholarshipUserProfileSharedFormConfigs} from "../../models/Utils";
import UserProfileAPI from "../../services/UserProfileAPI";
import {userProfileFormConfig} from "../../models/UserProfile";

const userProfileSharedFormConfigs = scholarshipUserProfileSharedFormConfigs
    .map(config => {
        config.className = null;
        return config;
    }).filter(config => config.keyName !== 'criteria_info');

class UserProfileEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 1,
        }
    }

    updateForm = (event) => {
        event.preventDefault();

        const { updateLoggedInUserProfile, userProfile } = this.props;

        const value = event.target.value;

        let newValue = userProfile[event.target.name];
        console.log('event.target.name, newValue', event.target.name, newValue);
        if ( Array.isArray(userProfile[event.target.name]) && !Array.isArray(value) ) {
            newValue.push(value);
        } else {
            newValue =value;
        }
        console.log('After event.target.name, newValue', event.target.name, newValue);

        let newUserProfile = {
            ...userProfile,
            [event.target.name]: newValue
        };
        updateLoggedInUserProfile(newUserProfile);
    };

    changePage = (pageNumber) => {
        this.setState({pageNumber})
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
        const {pageNumber} = this.state;

        return (
            <div>
                <h1>Edit Profile</h1>
                {pageNumber === 1 &&
                <FormDynamic onUpdateForm={this.updateForm}
                             model={userProfile}
                             inputConfigs=
                                 {userProfileFormConfig}
                />}
                {pageNumber === 2 &&
                <FormDynamic onUpdateForm={this.updateForm}
                             model={userProfile}
                             inputConfigs=
                                 {userProfileSharedFormConfigs}
                />}
                <div className="my-2" style={{clear: 'both'}}>
                    {pageNumber !== 2 &&
                    <button className="btn btn-outline-primary float-right col-md-6"
                            onClick={() => this.changePage(pageNumber+1)}>Next</button>}
                    {pageNumber !== 1 &&
                    <button className="btn btn-outline-primary float-left col-md-6"
                            onClick={() => this.changePage(pageNumber-1)}>Prev</button>}
                </div>
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

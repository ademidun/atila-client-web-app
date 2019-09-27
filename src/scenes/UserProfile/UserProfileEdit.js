import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import FormDynamic from "../../components/Form/FormDynamic";
import {scholarshipUserProfileSharedFormConfigs, toastNotify} from "../../models/Utils";
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
        if ( Array.isArray(userProfile[event.target.name]) && !Array.isArray(value) ) {
            newValue.push(value);
        } else {
            newValue =value;
        }

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
            .then(res=>{
                toastNotify('😃 User Profile successfully saved!');
                console.log({res});
            })
            .catch(err=> {
                let postError = err.response && err.response.data;
                postError = JSON.stringify(postError, null, 4);
                toastNotify(`🙁${postError}`, 'error');
        });
    };

    render () {

        const {userProfile, title, className} = this.props;
        const {pageNumber} = this.state;

        return (
            <div className={className}>
                {title}
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
                        onClick={this.submitForm}>Save</button>
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

UserProfileEdit.defaultProps = {
    title: (<h1>Edit Profile</h1>),
    className: '',
};

UserProfileEdit.propTypes = {
    // redux
    userProfile: PropTypes.shape({}).isRequired,
    updateLoggedInUserProfile: PropTypes.func.isRequired,
    title: PropTypes.node,
    className: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit);

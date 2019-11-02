import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";


class UserProfileSettings extends React.Component {

    render () {

        return (
            <div>
                <h1>Settings</h1>
                <p>Add some stuff here</p>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

UserProfileSettings.defaultProps = {
    // redux
    userProfile: null,
};

UserProfileSettings.propTypes = {
    // redux
    userProfile: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps)(UserProfileSettings);

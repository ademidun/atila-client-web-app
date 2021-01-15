import React from 'react';
import { connect } from "react-redux";
import { toastNotify } from "../models/Utils";

class Referral extends React.Component {
    componentDidMount() {
        const { userProfile } = this.props
        const { referredByUsername } = this.props.match.params;

        if (referredByUsername) {
            localStorage.setItem('referred_by', referredByUsername);
            if (!userProfile) {
                toastNotify('The user who referred you has been saved and will be used upon registration.', 'info')
            }
        }

        this.props.history.push('')
    }

    render() {
        return null
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(Referral);

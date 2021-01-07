import React from 'react';
import { connect } from "react-redux";
import { toastNotify } from "../models/Utils";

class Referral extends React.Component {
    componentDidMount() {
        const { referredByUsername } = this.props.match.params;
        localStorage.setItem('referred_by', referredByUsername);
        toastNotify('The user who referred you has been saved and will be saved upon registration.', 'info')
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

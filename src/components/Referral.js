import React from 'react';
import { connect } from "react-redux";
import { toastNotify } from "../models/Utils";
import { Link } from 'react-router-dom';

class Referral extends React.Component {
    componentDidMount() {
        const { userProfile } = this.props
        const { referredByUsername } = this.props.match.params;

        if (referredByUsername) {


            const referredByMessage = (<p>
            You were referred by {referredByUsername}.This referral has been saved 
            and will be used when you <Link to="/register">register</Link>.
            </p>)
            localStorage.setItem('referred_by', referredByUsername);
            if (!userProfile) {
                toastNotify(referredByMessage, 'info')
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

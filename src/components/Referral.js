import React from 'react';
import { connect } from "react-redux";
import  { Redirect } from 'react-router-dom'

class Referral extends React.Component {
    componentDidMount() {
        const { referredByUsername } = this.props.match.params;
        localStorage.setItem('referred_by', referredByUsername);

    }

    render() {
        return <Redirect to=''  />
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(Referral);

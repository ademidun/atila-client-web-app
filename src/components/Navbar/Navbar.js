import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import {withRouter} from "react-router-dom";

import './Navbar.scss';
import {initializeLoggedInUserProfile, setLoggedInUserProfile} from "../../redux/actions/user";
import Header from "./Header";

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authService: {
                isLoggedIn: false
            },
            searchQuery: '',
            isLoadingUserProfile: false,
        };
    }

    componentDidMount() {

        const { initializeLoggedInUserProfile } = this.props;
        initializeLoggedInUserProfile();
    }

    render() {

        return (<Header />);
    }
}
Navbar.defaultProps = {
    userProfile: null,
    isLoadingLoggedInUserProfile: false,
};

Navbar.propTypes = {
    initializeLoggedInUserProfile: PropTypes.func.isRequired,
    setLoggedInUserProfile: PropTypes.func.isRequired,
    userProfile: PropTypes.shape({}),
    isLoadingLoggedInUserProfile: PropTypes.bool,
};

const mapStateToProps = state => {
    return {
        userProfile: state.data.user.loggedInUserProfile,
        isLoadingLoggedInUserProfile: state.ui.user.isLoadingLoggedInUserProfile
    };
};
const mapDispatchToProps = {
    initializeLoggedInUserProfile,
    setLoggedInUserProfile,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
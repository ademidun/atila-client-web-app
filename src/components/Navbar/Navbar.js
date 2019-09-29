import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import * as NavbarBootstrap from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

import {Link, withRouter} from "react-router-dom";

import './Navbar.scss';
import UserProfileAPI from "../../services/UserProfileAPI";
import {initializeLoggedInUserProfile, setLoggedInUserProfile} from "../../redux/actions/user";
import Dropdown from "react-bootstrap/Dropdown";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Loading from "../Loading";

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

    updateSearch = event => {
        event.preventDefault();
        this.setState({searchQuery: event.target.value});
    };

    submitSearch = event => {
        event.preventDefault();
        const {searchQuery} = this.state;
        this.props.history.push(`/search?q=${searchQuery}`);
    };

    logout = event => {
        event.preventDefault();
        const { setLoggedInUserProfile } = this.props;
        setLoggedInUserProfile(null);
        UserProfileAPI.logout();
        this.props.history.push("/");
    };

    render() {
        const { searchQuery } = this.state;
        const { userProfile, isLoadingLoggedInUserProfile } = this.props;
        const { location: {pathname} } = this.props;

        return (
            <React.Fragment>
                <NavbarBootstrap bg="white" expand="md" className="Navbar px-5 serif-font">
                    <NavbarBootstrap.Brand className="nav-logo"><Link to="/">Atila</Link></NavbarBootstrap.Brand>
                    <NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
                    <NavbarBootstrap.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Form inline  onSubmit={this.submitSearch}>
                                <input value={searchQuery} className="form-control search-input" type="text" name="search"
                                       placeholder="Enter a search term" onChange={this.updateSearch}/>
                                <Link to="/search" className="nav-item">Search</Link>
                            </Form>
                            <Link to="/scholarship" className="nav-item">Scholarships</Link>
                            <Link to="/essay" className="nav-item">Essays</Link>
                            <Link to="/blog" className="nav-item">Blogs</Link>
                            {!userProfile && !isLoadingLoggedInUserProfile &&
                            <Link to={`/login?redirect=${pathname}`} className="nav-item">Login</Link>}
                            {
                                userProfile &&
                                <React.Fragment>

                                    <Dropdown>
                                        <Dropdown.Toggle style={{ backgroundColor: 'trabsparent' }}>
                                            <FontAwesomeIcon icon={faUser} />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Link to="/scholarship/add" className="dropdown-item">Add Scholarship</Link>
                                            <Link to={`/profile/${userProfile.username}`} className="dropdown-item">
                                                View Profile
                                            </Link>
                                            <Link to={`/profile/${userProfile.username}/edit`}
                                                  className="dropdown-item">
                                                Edit Profile
                                            </Link>
                                            <Dropdown.Divider />
                                            <button onClick={this.logout}
                                                    className="btn btn-link dropdown-item"
                                                    style={{ display: 'inherit' }}
                                            >Logout</button>

                                        </Dropdown.Menu>
                                    </Dropdown>
                                </React.Fragment>
                            }
                        </Nav>
                    </NavbarBootstrap.Collapse>
                </NavbarBootstrap>
                {
                    isLoadingLoggedInUserProfile &&
                    <Loading className="col-12" title="Loading UserProfile..." />
                }
                <hr style={{ margin: 0 }}/>
            </React.Fragment>
        );
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
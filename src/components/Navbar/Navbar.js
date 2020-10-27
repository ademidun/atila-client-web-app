import React from 'react';
import PropTypes from "prop-types";
import {Row, Col, Menu, Tag, Button,} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Link, withRouter} from "react-router-dom";
import {initializeLoggedInUserProfile, setLoggedInUserProfile} from "../../redux/actions/user";
import {connect} from "react-redux";
import './Navbar.scss'
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import LogRocket from 'logrocket';
import Environment from "../../services/Environment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

const {SubMenu} = Menu;

class Navbar extends React.Component {
    state = {
        menuVisible: false,
        showMobileMenu: false,
    };

    componentDidMount() {

        const { initializeLoggedInUserProfile } = this.props;
        initializeLoggedInUserProfile();
    }

    logout = event => {
        event.preventDefault();
        const { setLoggedInUserProfile } = this.props;
        setLoggedInUserProfile(null);
        UserProfileAPI.logout();
        this.props.history.push("/");
    };

    toggleShowMobileMenu = event => {
        const { showMobileMenu } = this.state;
        this.setState({showMobileMenu: !showMobileMenu});
    };

    render() {
        const { showMobileMenu } = this.state;
        const { userProfile, isLoadingLoggedInUserProfile } = this.props;
        const { location: { pathname, search } } = this.props;

        if(userProfile && Environment.name !== 'dev') {
            LogRocket.identify(userProfile.user, {
                name: `${userProfile.first_name} ${userProfile.last_name}`,
                email: `${userProfile.email}`,

                // Add your own custom user variables here, ie:
                userId: `${userProfile.user}`
            });
        }

        if (pathname === '/premium') {
            return (<div id="header"
                         className="header mx-3 mx-lg-5 mt-2">
                    <Row>
                        <Col xxl={4} xl={5} lg={8} md={8} sm={8} xs={0}>
                            <h2 id="logo" className="text-center4">
                                <span>Atila</span>
                            </h2>
                        </Col>
                    </Row>
                </div>
            )
        }

        const menuItems = (mode="inline") => (
            <Menu id="nav" key="nav" mode={mode}
                  style={{float: "none"}}>
                <Menu.Item key="start">
                    <Link to="/start">
                        Start a Scholarship{' '}
                        <Tag color="green">new</Tag>
                    </Link>
                </Menu.Item>
                <Menu.Item key="search">
                    <Link to="/search">Search</Link>
                </Menu.Item>
                <Menu.Item key="essays">
                    <Link to="/essay">Essays</Link>
                </Menu.Item>
                <Menu.Item key="blogs">
                    <Link to="/blog">Blogs</Link>
                </Menu.Item>
                <Menu.Item key="scholarships">
                    <Link to="/scholarship">Scholarships</Link>
                </Menu.Item>
                <Menu.Item key="high-school">
                    <Link to="/high-school">High School</Link>
                </Menu.Item>
                <Menu.Item key="about">
                    <Link to="/about">About</Link>
                </Menu.Item>
                {!userProfile && !isLoadingLoggedInUserProfile &&
                <Menu.Item key="login">
                    <Link to={`/login?redirect=${pathname}${search}`}
                          style={{color:'#007bff'}}
                          className="font-weight-bold">
                        Login
                    </Link>
                </Menu.Item>
                }
                {!userProfile && !isLoadingLoggedInUserProfile &&
                <Menu.Item key="register" className="disable-ant-menu-item-active">
                    <Button type="primary" size="large">
                        <Link to={`/register?redirect=${pathname}${search}`}>
                            Sign Up
                        </Link>
                    </Button>
                </Menu.Item>
                }
                {
                    userProfile &&
                    <SubMenu
                        key="user"
                        title={<span><UserOutlined /></span>}
                    >
                        <Menu.Item key="add-scholarship">
                            <Link to="/scholarship/add">
                                Add Scholarship
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="view-profile">
                            <Link to={`/profile/${userProfile.username}`}>
                                View Profile
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="edit-profile">
                            <Link to={`/profile/${userProfile.username}/edit`}>
                                Edit Profile
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="logout">
                            <button onClick={this.logout}
                                    className="btn btn-link"
                                    style={{ display: 'inherit' }}
                            >Logout</button>
                        </Menu.Item>
                    </SubMenu>
                }

            </Menu>
        );

        const menu = menuItems("horizontal");

        const mobileMenu = (
            <div style={{
                direction: "rtl",
                textAlign: "justify",
            }}>
                <FontAwesomeIcon
                    icon={faBars}
                    onClick={this.toggleShowMobileMenu}
                    style={{ fontSize: '26px',
                             color: '#194F87'
                    }} />

                {
                showMobileMenu &&
                menuItems()
                }
                {/*<hr className="mt-0"/>*/}
            </div>
        );

        const navbarLogo = (
            <h2 id="logo"
                className="text-center">
                <Link to="/">
                    <span>Atila</span>
                </Link>
            </h2>
        );

        return (
            <div id="header"
                 className="header mx-3 mx-lg-5 mt-2">
                <Row>
                    <Col xxl={4} xl={5} lg={8} md={8} sm={0} xs={0}>
                        {navbarLogo}
                    </Col>
                    <Col xxl={20} xl={19} lg={16} md={16} sm={0} xs={0}>
                        {menu}
                    </Col>
                </Row>
                <Row>
                    <Col xxl={0} xl={0} lg={0} md={0} sm={6} xs={6}>
                        {navbarLogo}
                    </Col>
                    <Col xxl={0} xl={0} lg={0} md={0} sm={6} xs={6} offset={12}>
                        {mobileMenu}
                    </Col>
                </Row>
                {
                    isLoadingLoggedInUserProfile &&
                    <Loading className="col-12" title="Loading UserProfile..." />
                }
            </div>
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
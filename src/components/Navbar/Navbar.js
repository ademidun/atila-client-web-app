import React, { useEffect, useState } from 'react';
import { Row, Col, Menu, Tag, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { initializeLoggedInUserProfile, setLoggedInUserProfile } from "../../redux/actions/user";
import './Navbar.scss';
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../Loading";
import LogRocket from 'logrocket';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import atilaLogo from "../../components/assets/atila-upway-logo-gradient-circle-border.png";

const { SubMenu } = Menu;

function Navbar() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    
    const userProfile = useSelector(state => state.data.user.loggedInUserProfile);
    const isLoadingLoggedInUserProfile = useSelector(state => state.ui.user.isLoadingLoggedInUserProfile);

    useEffect(() => {
        dispatch(initializeLoggedInUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (userProfile) {
            LogRocket.identify(userProfile.user, {
                name: `${userProfile.first_name} ${userProfile.last_name}`,
                email: `${userProfile.email}`,
                userId: `${userProfile.user}`
            });
        }
    }, [userProfile]);

    const logout = (event) => {
        event.preventDefault();
        dispatch(setLoggedInUserProfile(null));
        UserProfileAPI.logout();
        navigate("/");
    };

    const toggleShowMobileMenu = () => {
        setShowMobileMenu(prev => !prev);
    };

    if (location.pathname === '/premium') {
        return (
            <div id="header" className="header mx-3 mx-lg-5 mt-2">
                <Row>
                    <Col xxl={4} xl={5} lg={8} md={8} sm={8} xs={0}>
                        <h2 id="logo" className="text-center4">
                            <img src={atilaLogo} alt="Atila.ca logo"/>
                            <span>Atila</span>
                        </h2>
                    </Col>
                </Row>
            </div>
        );
    }

    const menuItems = (mode = "inline") => (
        <Menu id="nav" key="nav" mode={mode} style={{ float: "none" }}>
            <Menu.Item key="mentorship">
                <Link to="/mentorship">Mentorship</Link>
            </Menu.Item>
            <Menu.Item key="scholarships">
                <Link to="/scholarship">Scholarships</Link>
            </Menu.Item>
            {!isLoadingLoggedInUserProfile && !userProfile && (
                <>
                    <Menu.Item key="register" className="disable-ant-menu-item-active">
                        <Button type="primary" size="large">
                            <Link to={`/register?redirect=${location.pathname}${location.search}`}>
                                Sign Up
                            </Link>
                        </Button>
                    </Menu.Item>
                    <Menu.Item key="demo" className="disable-ant-menu-item-active">
                        <Button type="primary" size="large">
                            <Link to="/demo">Demo</Link>
                        </Button>
                    </Menu.Item>
                    <Menu.Item key="login">
                        <Link 
                            to={`/login?redirect=${location.pathname}${location.search}`}
                            style={{ color: '#007bff' }}
                            className="font-weight-bold"
                        >
                            Login
                        </Link>
                    </Menu.Item>
                </>
            )}

            <SubMenu key="more" title="More">
                <Menu.Item key="start">
                    <Link to="/start">Start a Scholarship</Link>
                </Menu.Item>
                <Menu.Item key="apply">
                    <Link to="/apply">How to Apply for a Scholarship</Link>
                </Menu.Item>
                <Menu.Item key="schools">
                    <Link to="/schools">The Best Universities for Getting a Job</Link>
                </Menu.Item>
                <Menu.Item key="finalists">
                    <Tag color="green">new</Tag>{' '}
                    <Link to="/finalists">Finalists</Link>
                </Menu.Item>
                <Menu.Item key="blogs">
                    <Link to="/blog">Blogs</Link>
                </Menu.Item>
                <Menu.Item key="essays">
                    <Link to="/essay">Essays</Link>
                </Menu.Item>
                <Menu.Item key="search">
                    <Link to="/search">Search</Link>
                </Menu.Item>
                <Menu.Item key="about">
                    <Link to="/about">About</Link>
                </Menu.Item>
            </SubMenu>

            {userProfile && (
                <SubMenu key="user" title={<UserOutlined />}>
                    <Menu.Item key="add-scholarship">
                        <Link to="/scholarship/add">Add Scholarship</Link>
                    </Menu.Item>
                    {userProfile.is_atila_admin && (
                        <Menu.Item key="admin">
                            <Link to="/admin">Admin</Link>
                        </Menu.Item>
                    )}
                    <Menu.Item key="view-profile">
                        <Link to={`/profile/${userProfile.username}`}>View Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="edit-profile">
                        <Link to={`/profile/${userProfile.username}/edit`}>Edit Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="logout">
                        <button 
                            onClick={logout}
                            className="btn btn-link"
                            style={{ display: 'inherit' }}
                        >
                            Logout
                        </button>
                    </Menu.Item>
                </SubMenu>
            )}
        </Menu>
    );

    const menu = menuItems("horizontal");

    const mobileMenu = (
        <div style={{ direction: "rtl", textAlign: "justify" }}>
            <FontAwesomeIcon
                icon={faBars}
                onClick={toggleShowMobileMenu}
                style={{ fontSize: '26px', color: '#194F87' }}
            />
            {showMobileMenu && menuItems()}
        </div>
    );

    const navbarLogo = (
        <h2 id="logo" className="text-center pt-2">
            <Link to="/">
                <img src={atilaLogo} alt="Atila.ca logo"/>
                <span>Atila</span>
            </Link>
        </h2>
    );

    return (
        <div id="header" className="header mx-3 mx-lg-5 mt-2">
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
            {isLoadingLoggedInUserProfile && (
                <Loading className="col-12" title="Loading UserProfile..." />
            )}
        </div>
    );
}

export default Navbar;
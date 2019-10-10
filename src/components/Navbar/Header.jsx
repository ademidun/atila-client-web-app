import React from 'react';
import PropTypes from "prop-types";
import { Row, Col, Icon, Menu } from 'antd';
import {Link, withRouter} from "react-router-dom";
import {initializeLoggedInUserProfile, setLoggedInUserProfile} from "../../redux/actions/user";
import {connect} from "react-redux";
import './Navbar.scss'
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";

const {SubMenu} = Menu;

class Header extends React.Component {
    state = {
        menuVisible: false,
        menuMode: 'horizontal',
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

    render() {
        const { menuMode } = this.state;
        const { userProfile, isLoadingLoggedInUserProfile } = this.props;
        const { location: { pathname, search } } = this.props;

        const menu = (
            <Menu mode={menuMode} id="nav" key="nav">
                <Menu.Item key="essays">
                    <Link to="/essay">Essays</Link>
                </Menu.Item>
                <Menu.Item key="search">
                    <Link to="/search">Search</Link>
                </Menu.Item>
                <Menu.Item key="scholarships">
                    <Link to="/scholarship">Scholarships</Link>
                </Menu.Item>
                <Menu.Item key="blogs">
                    <Link to="/blog">Blogs</Link>
                </Menu.Item>

                {!userProfile && !isLoadingLoggedInUserProfile &&
                <Menu.Item key="login">
                    <strong>
                        <Link to={`/login?redirect=${pathname}${search}`}
                              className="nav-item">
                            Login
                        </Link>
                    </strong>
                </Menu.Item>
                }
                {
                    userProfile &&
                    <SubMenu
                        key="user"
                        title={<Icon type="user" />}
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
                        <Menu.Item key="search">
                            <Link to={`/search`}>
                                Search
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
                            >Logout</button></Menu.Item>
                    </SubMenu>
                }
            </Menu>
        );

        return (
            <div id="header"
                 className="header mx-3 mx-lg-5 mt-2">
                <Row>
                    <Col xxl={4} xl={5} lg={8} md={8} sm={8} xs={0}>
                        <h2 id="logo" className="serif-font text-center4">
                            <Link to="/">
                                <span>Atila</span>
                            </Link>
                        </h2>
                    </Col>
                    <Col xxl={20} xl={19} lg={16} md={16} sm={16} xs={0}>
                        <div className="header-meta">
                            <div id="menu">{menu}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}>
                        <h2 id="logo"
                            className="serif-font text-center ant-col-xs-24">
                            <Link to="/">
                                <span>Atila</span>
                            </Link>
                        </h2>
                    </Col>
                    <Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}
                         className="ml-4">
                        <div className="header-meta">
                            <div id="menu">
                                {menu}
                            </div>
                        </div>
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

Header.defaultProps = {
    userProfile: null,
    isLoadingLoggedInUserProfile: false,
};

Header.propTypes = {
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
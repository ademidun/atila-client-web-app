import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Icon, Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import {
  initializeLoggedInUserProfile,
  setLoggedInUserProfile,
} from "../../redux/actions/user";
import { connect } from "react-redux";
import "./Navbar.scss";
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import LogRocket from "logrocket";

const { SubMenu } = Menu;

class Navbar extends React.Component {
  state = {
    menuVisible: false,
    menuMode: "horizontal",
  };

  componentDidMount() {
    const { initializeLoggedInUserProfile } = this.props;
    initializeLoggedInUserProfile();
  }

  logout = (event) => {
    event.preventDefault();
    const { setLoggedInUserProfile } = this.props;
    setLoggedInUserProfile(null);
    UserProfileAPI.logout();
    this.props.history.push("/");
  };

  render() {
    let navbarID = "header";
    const { menuMode } = this.state;
    const { userProfile, isLoadingLoggedInUserProfile } = this.props;
    const {
      location: { pathname, search },
    } = this.props;

    if (userProfile) {
      LogRocket.identify(userProfile.user, {
        name: `${userProfile.first_name} ${userProfile.last_name}`,
        email: `${userProfile.email}`,

        // Add your own custom user variables here, ie:
        userId: `${userProfile.user}`,
      });
    }

    if (pathname === "/premium") {
      return (
        <div id='header' className='header mx-3 mx-lg-5 mt-2'>
          <Row>
            <Col xxl={4} xl={5} lg={8} md={8} sm={8} xs={0}>
              <h2 id='logo' className='text-center4'>
                <span>Atila</span>
              </h2>
            </Col>
          </Row>
        </div>
      );
    }

    if (pathname === "/schools") {
      navbarID = "ebook";
    }

    const menu = (
      <Menu
        mode={menuMode}
        id='nav'
        key='nav'
        style={{ backgroundColor: "transparent" }}
      >
        <Menu.Item key='essays'>
          <Link to='/essay'>Essays</Link>
        </Menu.Item>
        <Menu.Item key='search'>
          <Link to='/search'>Search</Link>
        </Menu.Item>
        <Menu.Item key='scholarships'>
          <Link to='/scholarship'>Scholarships</Link>
        </Menu.Item>
        <Menu.Item key='blogs'>
          <Link to='/blog'>Blogs</Link>
        </Menu.Item>
        <Menu.Item key='high-school'>
          <Link to='/high-school'>High School</Link>
        </Menu.Item>
        {/*{(!userProfile || !userProfile.is_atila_premium) ? (*/}
        {/*    <Menu.Item key="pricing">*/}
        {/*        <Link to="/pricing">Pricing</Link>*/}
        {/*    </Menu.Item>*/}
        {/*) : null*/}
        {/*}*/}

        {!userProfile && !isLoadingLoggedInUserProfile && (
          <Menu.Item key='login'>
            <Link
              to={`/login?redirect=${pathname}${search}`}
              style={{ color: "#007bff" }}
              className='font-weight-bold'
            >
              Login
            </Link>
          </Menu.Item>
        )}
        {userProfile && (
          <SubMenu key='user' title={<Icon type='user' />}>
            <Menu.Item key='add-scholarship'>
              <Link to='/scholarship/add'>Add Scholarship</Link>
            </Menu.Item>
            <Menu.Item key='view-profile'>
              <Link to={`/profile/${userProfile.username}`}>View Profile</Link>
            </Menu.Item>
            <Menu.Item key='search'>
              <Link to={`/search`}>Search</Link>
            </Menu.Item>
            <Menu.Item key='edit-profile'>
              <Link to={`/profile/${userProfile.username}/edit`}>
                Edit Profile
              </Link>
            </Menu.Item>
            <Menu.Item key='logout'>
              <button
                onClick={this.logout}
                className='btn btn-link'
                style={{ display: "inherit" }}
              >
                Logout
              </button>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    );

    return (
      <div id={navbarID} className=' mx-3 mx-lg-5 mt-2'>
        <Row>
          <Col xxl={4} xl={5} lg={8} md={8} sm={8} xs={0}>
            <h2 id='logo' className='text-center4'>
              <Link to='/'>
                <span>Atila</span>
              </Link>
            </h2>
          </Col>
          <Col xxl={20} xl={19} lg={16} md={16} sm={16} xs={0}>
            <div className='header-meta'>
              <div id='menu'>{menu}</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}>
            <h2 id='logo' className='text-center ant-col-xs-24'>
              <Link to='/'>
                <span>Atila</span>
              </Link>
            </h2>
          </Col>
          <Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24} className='ml-0'>
            <div className='header-meta'>
              <div id='menu'>{menu}</div>
            </div>
          </Col>
        </Row>
        {isLoadingLoggedInUserProfile && (
          <Loading className='col-12' title='Loading UserProfile...' />
        )}
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

const mapStateToProps = (state) => {
  return {
    userProfile: state.data.user.loggedInUserProfile,
    isLoadingLoggedInUserProfile: state.ui.user.isLoadingLoggedInUserProfile,
  };
};
const mapDispatchToProps = {
  initializeLoggedInUserProfile,
  setLoggedInUserProfile,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));

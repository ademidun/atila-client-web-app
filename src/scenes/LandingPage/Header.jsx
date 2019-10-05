import React from 'react';
import { Row, Col, Icon, Menu, Popover } from 'antd';
import './Header.scss'
import { enquireScreen } from 'enquire-js';

const LOGO_URL = 'https://gw.alipayobjects.com/zos/rmsportal/gVAKqIsuJCepKNbgbSwE.svg';

class Header extends React.Component {
    state = {
      menuVisible: false,
      menuMode: 'horizontal',
    };

    componentDidMount() {
      enquireScreen((b) => {
        this.setState({ menuMode: b ? 'inline' : 'horizontal' });
      });
    }

    render() {
      const { menuMode, menuVisible } = this.state;

      const menu = (
        <Menu mode={menuMode} id="nav" key="nav">
          <Menu.Item key="essays">
            <a>Essays</a>
          </Menu.Item>
          <Menu.Item key="blogs">
            <a><span>Blog</span></a>
          </Menu.Item>
          <Menu.Item key="scholarships">
            <a><span>Scholarships</span></a>
          </Menu.Item>
          <Menu.Item key="login">
            <strong><a>Login</a></strong>
          </Menu.Item>
        </Menu>
      );

      return (
        <div id="header" className="header">
          {menuMode === 'inline' ? (
            <Popover
              overlayClassName="popover-menu"
              placement="bottomRight"
              content={menu}
              trigger="click"
              visible={menuVisible}
              arrowPointAtCenter
              onVisibleChange={this.onMenuVisibleChange}
            >
              <Icon
                className="nav-phone-icon"
                type="menu"
                onClick={this.handleShowMenu}
              />
            </Popover>
                ) : null}
          <Row>
            <Col xxl={4} xl={5} lg={8} md={8} sm={24} xs={24}>
              <div id="logo" to="/">
                <img src={LOGO_URL} alt="logo" />
                <span>ANT DESIGN PRO</span>
              </div>
            </Col>
            <Col xxl={20} xl={19} lg={16} md={16} sm={0} xs={0}>
              <div className="header-meta">
                {menuMode === 'horizontal' ? <div id="menu">{menu}</div> : null}
              </div>
            </Col>
          </Row>
        </div>
      );
    }
}

export default Header;

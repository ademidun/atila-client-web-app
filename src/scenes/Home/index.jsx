import React from 'react';
import { IntlProvider } from 'react-intl';
import { enquireScreen } from 'enquire-js';
import Header from './Header';
import Banner from './Banner';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Footer from './Footer';
import cnLocale from './zh-CN';
import './static/style.less';
import "antd/lib/style/themes/default.less";

let isMobile = false;
enquireScreen((b) => {
  isMobile = b;
});

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    const appLocale = cnLocale;
    this.state = {
      appLocale,
      isMobile,
    };
  }
  componentDidMount() {
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
  }
  render() {
    const { appLocale } = this.state;
    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <div className="page-wrapper home">
          <Header />
          <Banner isMobile={this.state.isMobile} />
          <Page1 isMobile={this.state.isMobile} />
          <Page2 isMobile={this.state.isMobile} />
          <Page3 />
          <Footer />
        </div>
      </IntlProvider>
    );
  }
}
export default Home;

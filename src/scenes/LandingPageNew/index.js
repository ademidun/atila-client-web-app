import React from 'react';
import { enquireScreen } from 'enquire-js';
import Header from './Header';
import Banner from './Banner';
import Footer from './Footer';
import "antd/lib/style/themes/default.less";
import 'antd/dist/antd.css';
import {IntlProvider} from "react-intl";
import cnLocale from "../Home/zh-CN";

let isMobile = false;
enquireScreen((b) => {
    isMobile = b;
});

class Home extends React.Component {
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
                    <Footer />
                </div>
            </IntlProvider>
        );
    }
}
export default Home;

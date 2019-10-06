import React from 'react';
import { enquireScreen } from 'enquire-js';
import Banner from './Banner';
import 'antd/dist/antd.css';
import './index.scss';
import './Reponsive.scss';
import WhatIsAtila from "./WhatIsAtila";
import Page2 from "./Page2";
import Page3 from "./Page3";
import {IntlProvider} from "react-intl";
import cnLocale from "./zh-CN";

let isMobile = false;
enquireScreen((b) => {
    isMobile = b;
});

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        return (
            <IntlProvider locale={cnLocale.locale} messages={cnLocale.messages}>
                <div className="page-wrapper home">
                    <Banner isMobile={this.state.isMobile} />
                    <WhatIsAtila isMobile={this.state.isMobile} />
                    <Page2 isMobile={this.state.isMobile} />
                    <Page3 />
                </div>
            </IntlProvider>
        );
    }
}
export default LandingPage;

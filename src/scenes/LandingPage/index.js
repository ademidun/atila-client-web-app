import React from 'react';
import { enquireScreen } from 'enquire-js';
import Banner from './Banner';
import 'antd/dist/antd.css';
import './index.scss';
import './Reponsive.scss';
import WhatIsAtila from "./WhatIsAtila";
import HowDoesAtilaMoreMoney from "./HowDoesAtilaMoreMoney";

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
                <div className="page-wrapper home">
                    <Banner isMobile={this.state.isMobile} />
                    <WhatIsAtila isMobile={this.state.isMobile} />
                    <HowDoesAtilaMoreMoney />
                </div>
        );
    }
}
export default LandingPage;

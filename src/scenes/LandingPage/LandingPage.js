import React from 'react';
import {enquireScreen} from 'enquire-js';
import Banner from './Banner';
import 'antd/dist/antd.css';
import './LandingPage.scss';
import './Reponsive.scss';
import WhatIsAtila from "./WhatIsAtila";
import HowItWorks from "./HowItWorks";
import MoreFeatures from "./MoreFeatures";
import LandingPageContent from "./LandingPageContent";
import LandingPageLiveDemo from "./LandingPageLiveDemo";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {blogs, essays} from "./LandingPageData";

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
                    <HelmetSeo content={defaultSeoContent}/>
                    <Banner isMobile={this.state.isMobile} />
                    <WhatIsAtila isMobile={this.state.isMobile} />
                    <div className="p-5">
                        <Link to="/register" className="btn btn-primary center-block font-size-xl">
                            Register for Free
                        </Link>
                    </div>
                    <HowItWorks/>
                    <MoreFeatures/>
                    <hr/>
                    <LandingPageContent
                        title={'Blog'}
                        description={"Learn from other students' stories"}
                        contentList={blogs} />
                    <hr/>
                    <LandingPageContent
                        title={'Essays'}
                        description={"Read the essays that got students acceptance to top schools and win major scholarships."}
                        contentList={essays} />
                    <hr />
                    <LandingPageLiveDemo />
                    <hr />
                    <SubscribeMailingList />
                    <div className="p-5">
                        <Link to="/register" className="btn btn-primary center-block font-size-xl">
                            Register for Free
                        </Link>
                    </div>
                </div>
        );
    }
}
export default LandingPage;

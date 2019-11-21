import React from 'react';
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
import {connect} from "react-redux";
import BannerLoggedIn from "./BannerLoggedIn";

class LandingPage extends React.Component {

    render() {

        const { userProfile } = this.props;
        return (
                <div className="page-wrapper home">
                    <HelmetSeo content={defaultSeoContent}/>

                    {!userProfile && <Banner/>}
                    {userProfile && <BannerLoggedIn/>}

                    {!userProfile &&
                    <React.Fragment>
                        <WhatIsAtila/>
                        <div className="p-5">
                            <Link to="/register" className="btn btn-primary center-block font-size-xl">
                                Register for Free
                            </Link>
                        </div>
                        <HowItWorks/>
                        <MoreFeatures/>
                        <hr/>
                    </React.Fragment>
                    }
                    <LandingPageContent
                        title={'Blog'}
                        description={!userProfile? "Learn from other students' stories": null}
                        contentList={blogs} />
                    <hr/>
                    <LandingPageContent
                        title={'Essays'}
                        description={!userProfile? "Read the essays that got students acceptance to top schools and win major scholarships.": null}
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
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(LandingPage);


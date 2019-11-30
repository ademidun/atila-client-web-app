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
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";

class LandingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipsDueSoon: null,
        }
    }
    componentDidMount() {
        this.loadContent();
    }

    loadContent = () => {

        this.setState({ scholarshipsDueSoonIsLoading: true });
        ScholarshipsAPI.getDueSoon()
            .then(res => {
                const scholarshipsDueSoon = res.data.results;
                this.setState({ scholarshipsDueSoon });
            })
            .catch(() => {})
            .finally(() => {
                this.setState({ scholarshipsDueSoonIsLoading: false });
            });
    };

    render() {

        const { userProfile } = this.props;
        const { scholarshipsDueSoon, scholarshipsDueSoonIsLoading } = this.state;

        const scholarshipsDueSoonContent = (<React.Fragment>
            {scholarshipsDueSoonIsLoading &&
            <Loading title="Loading Scholarships ..." />
            }
            {scholarshipsDueSoon &&
            <LandingPageContent title={`${userProfile? 'Your': ''} Scholarships Due Soon`}
                                contentList={scholarshipsDueSoon}
                                contentType="scholarship" />
            }
        </React.Fragment>);
        return (
                <div className="page-wrapper home">
                    <HelmetSeo content={defaultSeoContent}/>

                    {!userProfile &&
                    <React.Fragment>
                        <Banner/>
                        {scholarshipsDueSoonContent}
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
                    {userProfile &&
                    <React.Fragment>
                        <BannerLoggedIn/>
                        {scholarshipsDueSoonContent}
                        <hr />
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


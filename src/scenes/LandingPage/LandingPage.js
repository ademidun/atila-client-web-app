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
import SearchApi from "../../services/SearchAPI";

class LandingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipsDueSoon: null,
            scholarshipsRecentlyAdded: null,
            scholarshipsForLocation: null,
            searchLocation: 'Ontario'
        }
    }
    componentDidMount() {
        this.loadContent();
    }

    loadContent = async () => {

        // TODO: mock the loadContent() function in LandingPage.test.js
        if (process.env.NODE_ENV ==='test') {
            return
        }

        this.setState({ scholarshipsDueSoonIsLoading: true });
        const { userProfile } = this.props;

        let searchLocation = this.state.searchLocation;

        if(userProfile && userProfile.city[0] && userProfile.city[0].name) {
            searchLocation = userProfile.city[0].name;
        }

        const scholarshipPromises = [
            ScholarshipsAPI.list('due-soon'),
            ScholarshipsAPI.list('?ordering=date_time_created'),
            SearchApi.search(searchLocation),
        ];

        try {
            let [scholarshipsDueSoonResponse, scholarshipsRecentlyAddedResponse,
                scholarshipsForLocationResponse] = await Promise.all(scholarshipPromises);

            const scholarshipsDueSoon = scholarshipsDueSoonResponse.data.results.slice(0,3);
            const scholarshipsRecentlyAdded = scholarshipsRecentlyAddedResponse.data.results.slice(0,3);
            const scholarshipsForLocation = scholarshipsForLocationResponse.data.scholarships.slice(0,3);
            this.setState({ scholarshipsDueSoon, scholarshipsRecentlyAdded,
                scholarshipsForLocation, searchLocation });
            this.setState({ scholarshipsDueSoonIsLoading: false });

        }
        catch(err) {
            console.log(err);
            this.setState({ scholarshipsDueSoonIsLoading: false });
        }
    };

    render() {

        const { userProfile } = this.props;
        const { scholarshipsDueSoon, scholarshipsDueSoonIsLoading,
            scholarshipsRecentlyAdded, scholarshipsForLocation, searchLocation } = this.state;

        const scholarshipsContent = (<React.Fragment>
            {scholarshipsDueSoonIsLoading &&
            <Loading title="Loading Scholarships ..." />
            }
            {scholarshipsDueSoon &&
            <LandingPageContent title={`${userProfile? 'Your': ''} Scholarships Due Soon`}
                                contentList={scholarshipsDueSoon}
                                contentType="scholarship" />
            }
            {scholarshipsRecentlyAdded &&
            <React.Fragment>
            <hr/>
            <LandingPageContent title={`Scholarships Recently Added`}
                                contentList={scholarshipsRecentlyAdded}
                                contentType="scholarship" />
            </React.Fragment>
            }
            {scholarshipsForLocation &&
            <React.Fragment>
            <hr/>
            <LandingPageContent title={`Scholarships For ${searchLocation}`}
                                contentList={scholarshipsForLocation}
                                contentType="scholarship" />
            </React.Fragment>
            }
        </React.Fragment>);
        return (
                <div className="page-wrapper home">
                    <HelmetSeo content={defaultSeoContent}/>

                    {!userProfile &&
                    <React.Fragment>
                        <Banner/>
                        {scholarshipsContent}
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
                        {scholarshipsContent}
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


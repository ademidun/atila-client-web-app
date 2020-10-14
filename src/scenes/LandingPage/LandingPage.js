import React from 'react';
import Banner from './Banner';
import './LandingPage.scss';
import './Reponsive.scss';
import HowItWorks from "./HowItWorks";
import MoreFeatures from "./MoreFeatures";
import LandingPageContent from "./LandingPageContent";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {connect} from "react-redux";
import BannerLoggedIn from "./BannerLoggedIn";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";

class LandingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipsDueSoon: null,
            scholarshipsRecentlyAdded: null,
        }
    }
    componentDidMount() {
        this.loadContent()
            .finally();
    }

    loadContent = async () => {

        // TODO: mock the loadContent() function in LandingPage.test.js
        if (process.env.NODE_ENV ==='test') {
            return
        }

        this.setState({ scholarshipsDueSoonIsLoading: true });

        const scholarshipPromises = [
            ScholarshipsAPI.list('due-soon'),
            ScholarshipsAPI.list('?ordering=date_time_created'),
        ];

        try {
            let [scholarshipsDueSoonResponse, scholarshipsRecentlyAddedResponse] =
                await Promise.all(scholarshipPromises);

            const scholarshipsDueSoon = scholarshipsDueSoonResponse.data.results.slice(0,3);
            const scholarshipsRecentlyAdded = scholarshipsRecentlyAddedResponse.data.results.slice(0,3);
            this.setState({ scholarshipsDueSoon, scholarshipsRecentlyAdded });
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
            scholarshipsRecentlyAdded } = this.state;

        const scholarshipsContentDueSoon = (<React.Fragment>
            {scholarshipsDueSoonIsLoading &&
            <Loading title="Loading Scholarships ..." />
            }
            {scholarshipsDueSoon &&
            <LandingPageContent title={`${userProfile? 'Your': ''} Scholarships Due Soon`}
                                contentList={scholarshipsDueSoon}
                                contentType="scholarship" />
            }
        </React.Fragment>);
        const scholarshipsContentRecentlyAdded = (<React.Fragment>
            {scholarshipsRecentlyAdded &&
            <React.Fragment>
            <hr/>
            <LandingPageContent title={`Scholarships Recently Added`}
                                contentList={scholarshipsRecentlyAdded}
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
                        <hr/>
                        <HowItWorks accountType={"Student"}/>
                        {scholarshipsContentRecentlyAdded}
                        <hr/>
                        <div className="p-5">
                            <Link to="/register" className="btn btn-primary center-block font-size-xl">
                                Register for Free
                            </Link>
                        </div>
                        <hr/>
                        <HowItWorks accountType={"Sponsor"}/>
                        <hr/>
                        <MoreFeatures/>
                        <hr/>
                        {scholarshipsContentDueSoon}
                    </React.Fragment>
                        }
                    {userProfile &&
                    <React.Fragment>
                        <BannerLoggedIn/>
                        {scholarshipsContentRecentlyAdded}
                        {scholarshipsContentDueSoon}
                        <hr />
                    </React.Fragment>
                    }
                    <hr />
                    <SubscribeMailingList />
                    {!userProfile &&
                    <div className="p-5">
                        <Link to="/register" className="btn btn-primary center-block font-size-xl">
                            Register for Free
                        </Link>
                    </div>
                    }
                </div>
        );
    }
}
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(LandingPage);


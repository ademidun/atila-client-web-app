import React from 'react';
import Banner from './Banner';
import './LandingPage.scss';
import './Reponsive.scss';
import HowItWorks from "./HowItWorks";
// import MoreFeatures from "./MoreFeatures";
import LandingPageContent from "./LandingPageContent";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {connect} from "react-redux";
import BannerLoggedIn from "./BannerLoggedIn";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import Testimonials from "../../components/Testimonials";
import { SocialProof } from './SocialProof';
import EbookLandingBanner from '../Ebook/EbookLandingBanner';
import ScholarshipFinalists from "../Scholarship/ScholarshipFinalists";

class LandingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarshipsDirectApplication: null,
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
            ScholarshipsAPI.list('direct-application'),
            ScholarshipsAPI.list('due-soon'),
            ScholarshipsAPI.list('?ordering=date_time_created'),
        ];

        try {
            let [scholarshipsDirectApplicationResponse, scholarshipsDueSoonResponse, scholarshipsRecentlyAddedResponse] =
                await Promise.all(scholarshipPromises);

            // TODO temp show 4 direct application scholarships
            const scholarshipsDirectApplication = scholarshipsDirectApplicationResponse.data.results.slice(0,4);
            const scholarshipsDueSoon = scholarshipsDueSoonResponse.data.results.slice(0,3);
            const scholarshipsRecentlyAdded = scholarshipsRecentlyAddedResponse.data.results.slice(0,3);
            this.setState({ scholarshipsDirectApplication, scholarshipsDueSoon, scholarshipsRecentlyAdded });
            this.setState({ scholarshipsDueSoonIsLoading: false });

        }
        catch(err) {
            console.log(err);
            this.setState({ scholarshipsDueSoonIsLoading: false });
        }
    };

    render() {

        const { userProfile } = this.props;
        const { scholarshipsDirectApplication, scholarshipsDueSoon, scholarshipsDueSoonIsLoading,
            scholarshipsRecentlyAdded } = this.state;

        const scholarshipsContentDirectApplication = (<React.Fragment>
            {scholarshipsDueSoonIsLoading &&
            <Loading title="Loading Scholarships ..." />
            }
            {scholarshipsDirectApplication &&
            <>
            <LandingPageContent title={`Direct Application Scholarships`}
                                link="scholarship/direct"
                                contentList={scholarshipsDirectApplication}
                                contentType="scholarship" />
            </>
            }
            
        </React.Fragment>);
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
            <LandingPageContent title={`Scholarships Recently Added`}
            contentList={scholarshipsRecentlyAdded}
            contentType="scholarship" />
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
                        <hr/>
                        <HowItWorks accountType={"Sponsor"}/>
                        <hr/>
                        <SocialProof />
                        <hr/>
                        <div className="container">
                            <ScholarshipFinalists itemType={"essay"}
                                            allFinalists={true}
                                            title="Finalists"
                                            showEssayFirst={true}
                            />
                        </div>
                        <hr/>
                        {scholarshipsContentDirectApplication}
                        <hr/>
                        <Testimonials showSeo={false} filterArray={['Jasleen', 'Natalie', 'Grace', 'Chris', 'Hania', 'Oluwatofunmi']} />
                        <hr/>
                        {/*<hr/>*/}
                        {/*<MoreFeatures/>*/}
                        {scholarshipsContentRecentlyAdded}
                        <hr/>
                        {scholarshipsContentDueSoon}
                    </React.Fragment>
                        }
                    {userProfile &&
                    <React.Fragment>
                        <BannerLoggedIn/>
                        {scholarshipsContentDirectApplication}
                        {scholarshipsContentRecentlyAdded}
                        {scholarshipsContentDueSoon}
                        <hr />
                    </React.Fragment>
                    }
                    <EbookLandingBanner showLearnMoreCTA={true} />
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


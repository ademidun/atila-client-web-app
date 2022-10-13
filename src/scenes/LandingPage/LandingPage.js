import React from 'react';
import Banner from './Banner';
import './LandingPage.scss';
import './Reponsive.scss';
import HowItWorks from "./HowItWorks";
// import MoreFeatures from "./MoreFeatures";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {connect} from "react-redux";
import Testimonials from "../../components/Testimonials";
import { SocialProof } from './SocialProof';
import EbookLandingBanner from '../Ebook/EbookLandingBanner';
import ScholarshipFinalists from "../Scholarship/ScholarshipFinalists";

class LandingPage extends React.Component {

    render() {

        const { userProfile } = this.props;
        return (
                <div className="page-wrapper home">
                    <HelmetSeo content={defaultSeoContent}/>

                    {!userProfile &&
                    <React.Fragment>
                        <Banner/>
                        <hr/>
                        <HowItWorks accountType={"Mentee"}/>
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
                        <Testimonials showSeo={false} filterArray={['Jasleen', 'Natalie', 'Grace', 'Chris', 'Hania', 'Oluwatofunmi']} />
                        <hr/>
                        {/*<hr/>*/}
                        {/*<MoreFeatures/>*/}
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


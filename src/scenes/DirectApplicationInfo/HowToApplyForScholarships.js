import React from "react";
import HelmetSeo from "../../components/HelmetSeo";
import {Link} from "react-router-dom";
import EmbedResponsiveYoutubeVideo from "../LandingPage/LandingPageLiveDemo";
import { BackTop, Button } from "antd";
import { createTableOfContents } from "../../services/utils";
import InformationWithImage from "../../components/InformationWithImage";

export const howToStartAScholarshipInformationItems = [
    {
        title: "Summary",
        body: (<div>
            <ol>
                <li>Create your profile to find scholarships you qualify for.</li><br/>
                <li>Find a scholarship you want and click Apply now. Save time by pre-filling similar responses you've entered in the past.</li><br/>
                <li>If selected, write a thank you email to the sponsor</li><br/>
                <li>Accept payment and have funds deposited to your bank account within 24 hours<sup>*</sup>.
                    <br/>
                    <small>
                        <sup>*</sup>
                        Only currently available for students with Canadian or American Bank Accounts. <br/>
                    </small></li>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "Video Demo",
        body: (<div>
            <ol>
                <EmbedResponsiveYoutubeVideo youtubeVideoId="iLIHhuY9b0k"/>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "What happens if I win?",
        body: (<div>
            <ol>
                <li>You will receive an email notifying you that you won the award. Make sure that Atila emails are not going to your junk inbox or spam. You may have to mark Atila emails as not spam.</li><br/>
                <li>You write a thank you email to the scholarship sponsor</li><br/>
                <li>You will be listed as the scholarship winner on the scholarship page and Atila will contact you asking if we can share your winning application and your name and photo. You will have the opportunity to edit your application slightly before sharing.</li><br/>
                <li>If the scholarship awarded to you is valued at $5,000 or more, we will mail you a <Link to="/start#the-big-cheque-special-bonus">giant cheque</Link>.</li>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "How do I receive my funding?",
        body: (<div>
            <ol>
                <p>After you've completed the tasks above, you can click on the link in the email which you were provided and it will take you to the payment acceptance page. 
                    After you complete the security verification step a member of Atila will reach out to you about receiving your award.</p>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "Which countries can use Atila?",
        body: (<div>
            <ol>
                <p>Atila Direct Applications is currently only available to Canadian and American Students.
                    Students outside of Canada and the USA may use Atila to find scholarships, but they are not currently able to use the Atila Direct applications feature.
                    This means they cannot apply for scholarships through Atila and receive the funding through the Atila Platform.
                    We want to open up this feature to as many students as possible so if you're outside of Canada and want to use Atila,
                    contact us (you can use the chat in the bottom right) and let us know what country you're in so we know what countries we should prioritize in launching next.</p>
            </ol>
            <h5 className="text-center">
                <Link to="/start">
                    Interested in how to start a scholarship?
                </Link>
            </h5>
        </div>),
        image: "",
        imageCaption: "",
    },

];

class HowToApplyForScholarships extends React.Component {

    componentDidMount() {

        createTableOfContents(".how-to-apply-scholarship-questions");
    }

    render() {
        const presentationDescription = 'Easily apply for a scholarship with Atila.';
        const seoContent = {
            title: 'How to Apply for a Scholarship',
            description: presentationDescription,
            image: 'https://i.imgur.com/VFGbCKQ.png',
            slug: '/apply'
        };

        const ScholarshipCTA = (
            <React.Fragment>
                <Button type="primary" className="font-size-larger col-12 mt-3 my-2" style={{fontSize: "25px"}}>
                        <Link to="/register?type=student">
                            Step 1: Create an Account
                        </Link>
                    </Button>

                    <Button type="primary" className="font-size-larger col-12 my-2" style={{fontSize: "25px"}}>
                        <Link to="/scholarship">
                            Step 2: Find Scholarships
                        </Link>
                    </Button>
            </React.Fragment>
        )

        return (
            <div className="HowToStartAScholarship">
                <HelmetSeo content={seoContent} />
                <h1 className="col-sm-12 text-center">
                    How to Apply for a Scholarship
                </h1>
                <BackTop/>
                <div className="container mt-5">
                    <div className="card shadow p-3 how-to-apply-scholarship-questions">
                        {ScholarshipCTA}
                        {howToStartAScholarshipInformationItems.map(item => (
                            <InformationWithImage item={item} />
                        ))}
                        {ScholarshipCTA}
                    </div>
                </div>
            </div>
        );
    }
}

export default HowToApplyForScholarships;
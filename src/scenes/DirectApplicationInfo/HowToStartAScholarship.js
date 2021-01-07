import React from "react";
import {Link} from "react-router-dom";
import { BackTop } from "antd";
import HelmetSeo from "../../components/HelmetSeo";
import {PricingExample} from "../Payment/Pricing";
import {HowItWorksSponsor} from "../LandingPage/HowItWorks";
import {createTableOfContents} from "../../services/utils";

export const howToStartAScholarshipInformationItems = [
    {
        title: "How does it Work?",
        body: (<div>
            <ol>
                <li>Visit the add a scholarship page<br /><br />&nbsp;</li>
                <li>Enter details about the scholarship such as the name of the scholarship, who is eligible, the story behind why you started the scholarship, the deadline, funding amount, questions for the scholarship, etc.</li>
                <li>Fund your scholarship using a credit card<br /><br />&nbsp;</li>
                <li>Review Applications and pick a winner</li>
            </ol>
            <p>[gif of someone creating a scholarship]</p>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "How much does it Cost?",
        body: (<div>
            <ol>
                <p>The cost of sponsoring a scholarship on Atila is 9% of the scholarship amount. This fee is added to the scholarship amount.&nbsp;</p>
                <p>For example, suppose you wanted to start a scholarship for $1,000, you would pay an additional $9 (9%*$100) and $1.17 in HST (13% of the $9 fee). The total cost of your scholarship would be $110.17, student receives the full $100, Atila receives $9 and the Canada Revenue Agency receives $1.17.</p>
                <p>More Information can be found on the <Link to="/pricing">pricing</Link> page.</p>
            </ol>
        </div>),
        image: "https://i.imgur.com/s0xmEVc.png",
        imageCaption: "",
    },
    {
        title: "Are the scholarships tax-deductible?",
        body: (<div>
            <p>Scholarships are processed through the Atila Foundation which submitted it&rsquo;s application to be a Registered Charity in November 2020. <br/>

            If our application is approved in 2021, any donations made in the 2021 calendar year and beyond are eligible for tax-deductible receipts,
                even if the donation was made before Atila receives registered charity status (source: <a href="https://www.canada.ca/en/revenue-agency/services/charities-giving/charities/policies-guidance/policy-commentary-009-official-donation-receipts-a-newly-registered-charity.html">Canada Revenue Agency</a>).</p>
            <p>If you know anyone who can help speed up or increase our chances of being approved, please contact us.</p>
        </div>),
        image: "https://i.imgur.com/VEiCq75.png",
        imageCaption: "",
    },
];

class HowToStartAScholarship extends React.Component {

    componentDidMount() {

        createTableOfContents(".how-to-start-scholarship-questions");
    }

    render() {
        const presentationDescription = 'Easily start a scholarship with Atila. Enter scholarship details. Fund your scholarship. Pick a winner.';
        const seoContent = {
            title: 'How to Start a Scholarship',
            description: presentationDescription,
            image: 'https://i.ytimg.com/vi/bpyEWzblFrU/maxresdefault.jpg',
            slug: '/high-school'
        };

        return (
            <div className="HowToStartAScholarship">
                <HelmetSeo content={seoContent} />
                <BackTop/>
                <div className="container mt-5">
                    <div className="card shadow p-3 how-to-start-scholarship-questions">
                        {howToStartAScholarshipInformationItems.map(item => (
                            <div>
                                <h2>{item.title}</h2>
                                <div>
                                    {item.body}
                                </div>
                                {item.image &&

                                <div className="m-3 p-3 col-lg-7 col-sm-12">

                                    {/*Note: TO get the image to size responsively.
                            I just had to put it inside a parent div and add 'col-12' class.*/}
                                    <img src={item.image}
                                         alt={item.title}
                                         title={item.title}
                                         className="col-12"
                                    />
                                    {item.imageCaption &&
                                    <p className="col-12 text-center text-muted">
                                        {item.imageCaption}
                                    </p>
                                    }
                                </div>
                                }
                            </div>
                        ))}


                        <HowItWorksSponsor hideLearnMore={true} />
                        <div className="center-block">
                            <PricingExample/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HowToStartAScholarship;
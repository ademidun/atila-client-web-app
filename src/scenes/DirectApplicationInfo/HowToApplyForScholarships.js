import React from "react";
import HelmetSeo from "../../components/HelmetSeo";
import {Link} from "react-router-dom";
import LandingPageLiveDemo from "../LandingPage/LandingPageLiveDemo";
import {BackTop} from "antd";

export const howToStartAScholarshipInformationItems = [
    {
        title: "",
        body: (<div>
            <ol>
                <LandingPageLiveDemo youtubeVideoId="xC4e7J2sxuI"/>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "Step by Step",
        body: (<div>
            <ol>
                <li>Create your profile to find scholarships you qualify for.</li><br/>
                <li>Find a scholarship you want and click Apply now. Save time by pre-filling similar responses you've entered in the past.</li><br/>
                <li>If selected, write a thank you email to the sponsor</li><br/>
                <li>Connect your bank Account</li><br/>
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
        title: "After you win the award the following things happen:",
        body: (<div>
            <ol>
                <li>You will receive an email notifying you that you won the award. Make sure that Atila emails are not going to your junk inbox or spam. You may have to mark Atila emails as not spam (tk add link to how to do so in Gmail and hotmail).</li><br/>
                <li>You write a thank you email to the scholarship sponsor</li><br/>
                <li>You will be listed as the scholarship winner on the scholarship page and Atila will contact you asking if we can share your winning application and your name and photo. You will have the opportunity to edit your application slightly before sharing.</li><br/>
                <li>If the scholarship awarded to you is valued at $5,000 or more, we will mail you a giant cheque.</li>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "How do I receive my funding?",
        body: (<div>
            <ol>
                <p>After you've completed the tasks above, you can click on the link in the email which you were provided and it will take you to the payment acceptance page. You will then connect your bank account using <a href="https://stripe.com/">Stripe</a>, after connecting your bank account and accepting the payment, you should receive the funding typically within the next 24 hours.</p>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "Does Atila Save my Banking Information? Is it Secure?",
        body: (<div>
            <ol>
                <p>Atila does not save your banking information. All of the payment processing is handled using <a href="https://stripe.com/en-ca">Stripe</a>, a payment processing company that is used to handle payments for companies such as Shopify, Lyft, Doordash, Shopify and more.</p>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },
    {
        title: "Can Students outside of Canada and the USA use Atila?",
        body: (<div>
            <ol>
                <p>Students outside of Canada and the USA may use Atila to find scholarships, but they are not currently able to use the Atila Direct applications feature.
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
                <h1 className="col-sm-12 text-center">
                    How to Apply for a Scholarship
                </h1>
                <BackTop/>
                <div className="container mt-5">
                    <div className="card shadow p-3 how-to-start-scholarship-questions">
                        {howToStartAScholarshipInformationItems.map(item => (
                            <div>
                                <div className="p-3">
                                    <h2>{item.title}</h2>
                                    {item.body}
                                </div>
                                {item.image &&

                                <div className="col-12 mb-4 shadow text-center">

                                    {/*Note: TO get the image to size responsively.
                            I just had to put it inside a parent div and add 'col-12' class.*/}
                                    <img src={item.image}
                                         alt={item.title}
                                         title={item.title}
                                         className="col-12 p-3"
                                         style={{maxHeight: "450px", width: "auto"}}
                                    />
                                    {item.imageCaption &&
                                    <p className="col-12 text-center text-muted pb-3">
                                        {item.imageCaption}
                                    </p>
                                    }
                                </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default HowToApplyForScholarships;
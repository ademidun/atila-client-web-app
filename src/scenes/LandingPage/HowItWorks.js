import React from 'react';
import {Link} from "react-router-dom";
import {Button, Tag} from "antd";
import LandingPageLiveDemo from "./LandingPageLiveDemo";
import {
    ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP,
    ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_START_SCHOLARSHIP
} from "../../models/Constants";
import { SocialProof } from './SocialProof';
import {ImageGif} from "../../components/ImageGif";

function HowItWorks({accountType}) {

    if (accountType === "Student") {
        return (
            <HowItWorksStudent />
        );
    } else {
        return (
            <HowItWorksSponsor />
        )
    }
}

export default HowItWorks;

const howItWorksStudent = [
    {
        title: "Create Account",
        body: <React.Fragment>
            <Link to="register">Register</Link> for a free account in 15 seconds.<br/>

            Tell us your school, program, etc. to get matched
            with the right scholarships for you.

        </React.Fragment>,
        image: "https://imgur.com/QSmRBwv.jpg",
        gif: "https://media.tenor.com/images/223e03b12c6ab460cea1e485cac4ff4a/tenor.gif"
    },
    {
        title: "Apply for Scholarships",
        body: <React.Fragment>
            Apply for multiple scholarships all from one site.
            {/* TODO uncomment this line when we add this feature */}
            {/* Autofill similar responses used in past scholarships to save time. */}
        </React.Fragment>,
        image: "https://imgur.com/a49KkBZ.jpg"

    },
    {
        title: "Get Funded",
        body: <React.Fragment>
            Scholarship funding is directly deposited to your bank account
            within 24 hours of accepting award<sup>*</sup>.
            <br/>
            <small>
                <sup>*</sup>
            Only currently available for students with Canadian or American Bank Accounts.
            </small>
        </React.Fragment>,
        image: "https://imgur.com/1HufdyP.jpg"
    }
 ];


export const howItWorksSponsorItems = [
    {
        title: "Create Scholarship",
        body: <React.Fragment>
            Enter details about the scholarship: <br/>
            What inspired you to start it?{' '}
            When's the deadline?{' '}
            Who's eligible?{' '}
            Any short answer or essay questions?{' '} etc.
        </React.Fragment>,
        image: "https://imgur.com/HgIoMJ9.jpg"
    },
    {
        title: "Fund Scholarship",
        body: <p>Fund the scholarship with a credit card or debit card.
            <br/><br/>
            The minimum funding amount for a scholarship is just ${ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_START_SCHOLARSHIP}. <br/> <br/>
            The minimum funding amount for additional contributions is ${ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP}.
        </p>,
        image: "https://i.imgur.com/kgpSskJ.png",
    },
    {
        title: "Promote Scholarship",
        body: "Atila will help you promote your scholarship to our network of over 100 schools and student organizations.",
        image: "https://i.imgur.com/dqsLgzJ.png",
        imageCaption: "A few examples of the organizations we notify when scholarships relevant to their students are launched.",
    },
    {
        title: "Select Winner",
        body: "Review student applications and select winner. Funds directly transferred to winner's bank " +
            "account within 24 hours. All sponsors receive a thank you letter from winner.",
        image: "https://imgur.com/HDecTqt.jpg",
    },
    {
        title: <React.Fragment>The Big Cheque Special! <Tag color="green">Bonus</Tag></React.Fragment>,
        body: "For scholarships valued at over $5,000, we mail a big cheque to the winner " +
            "on behalf of the scholarship sponsor at no additional cost.",
        image: "https://i.imgur.com/6p5wMBm.jpeg",
        imageCaption: <React.Fragment>
            Source: <a href="https://lasentinel.net/dulans-restaurants-help-dorsey-grad-attend-howard-university.html"
                       target="_blank"
                       rel="noopener noreferrer">
            LA Sentinel
        </a>
            <br/>
            <small>Note: This is just an example. Atila has no affiliation with the scholarship shown above.</small>
        </React.Fragment>
    },
];

export function HowItWorksStudent() {

    return (
        <div className="container">
            <h1 className="col-sm-12 text-center">
                <Link to="/apply"> How to Get Scholarships </Link>
            </h1>
            <h2 className="col-sm-12 text-center">
                <Link to="/register">Create Profile.</Link>{' '}
                <Link to="/scholarship">Apply for Scholarships.</Link>{' '}
                Get Funded.
            </h2>
            <h5 className="col-sm-12 text-center text-muted">Atila is 100% free for students</h5>
            <SocialProof />
            <div className="offset-lg-1">

                <DescriptionsWithScreenshotsList items={howItWorksStudent} />


                <LandingPageLiveDemo youtubeVideoId="iLIHhuY9b0k" title="How to Start a Scholarship on Atila" />

                <h1 className="col-sm-12 text-center">
                    <Link to="/apply"> Learn More </Link>
                </h1>
            </div>
        </div>
    )
}

export function HowItWorksSponsor({hideLearnMore = false}) {

    return (
        <div className="container">

            <h1 className="col-sm-12 text-center">
                <Link to="/start"> How to Start a Scholarship </Link>
            </h1>

            <h2 className="col-sm-12 text-center">
                Create Scholarship.{' '}
                Fund Scholarship.{' '}
                Select Winner.
            </h2>
            {hideLearnMore &&
            <h5 className="text-center">
                <Link to="/apply">
                    Are you a student interested in how to apply for scholarships?
                </Link>
            </h5>
            }
            {/*Hide Learn More is true on the /start page. Which is when we want to show the demo first
            Otherwise, when used elsewhere, we want to show the demo after the screenshots*/}
            {hideLearnMore &&
            <LandingPageLiveDemo />
            }
            <div>
            <DescriptionsWithScreenshotsList items={howItWorksSponsorItems} />
            </div>

            {/*Hide Learn More is true on the /start page. Which is when we want to show the demo first
            Otherwise, when used elsewhere, we want to show the demo after the screenshots*/}
            {!hideLearnMore &&
                <LandingPageLiveDemo />
            }


            {!hideLearnMore &&
            <h1 className="col-sm-12 text-center">
                <Link to="/start"> Learn more </Link>
            </h1>
            }
            {hideLearnMore &&
            <Button type="primary" className="font-size-larger col-12 my-3" style={{fontSize: "25px"}}>
                <Link to="/register?type=sponsor">
                    Get Started
                </Link>
            </Button>
            }

        </div>
    )
}

export function DescriptionsWithScreenshotsList({items})   {

    return (
        <div className="row">
            {items.map( (item, index) => (
                <DescriptionWithScreenshot item={item} index={index} />
            ))}
        </div>
    )
}

export function DescriptionWithScreenshot({item, index=null})   {

    return (
        <React.Fragment key={item.title}>
            <div className="card shadow m-3 p-3 col-lg-4 col-sm-12">
                <h3 className="m-3 text-muted strong">
                    {index ? `${index+1}. ` : null} {item.title}
                </h3>
                <div className="m-3">
                    {item.body}
                </div>
            </div>
            <div className="card shadow m-3 p-3 col-lg-7 col-sm-12">

                {/*Note: TO get the image to size responsively.
                            I just had to put it inside a parent div and add 'col-12' class.*/}
                {/*<img src={item.image}
                     alt={item.title}
                     title={item.title}
                     className="col-12"
                />*/}
                <ImageGif
                    imageUrl={item.image}
                    gifUrl={item.gif}
                    title={item.title}/>

                {item.imageCaption &&
                <p className="col-12 text-center text-muted">
                    {item.imageCaption}
                </p>
                }
            </div>

        </React.Fragment>
    )
}
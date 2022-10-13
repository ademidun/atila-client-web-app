import React from 'react';
import {Link} from "react-router-dom";
import {Button, Tag} from "antd";
import EmbedResponsiveYoutubeVideo from "./LandingPageLiveDemo";
import {ImageGif} from "../../components/ImageGif";
import {Currencies} from "../../models/ConstantsPayments";

function HowItWorks({accountType}) {

    switch (accountType) {
        case "Mentee":
            return (
                <HowItWorksMentee />
            );
        case "Student":
            return (
                <HowItWorksStudent />
            );
    
        default:
            return (
                <HowItWorksSponsor />
            )
    }
}

export default HowItWorks;



const mentorshipPackageExample = "https://docs.google.com/document/d/1kWSgIRZtTG1VfcFghS8ENRS8RtbK-1Env5ecwavQwCA/edit#";

const howItWorksMentee = [
    {
        title: <Link to="/mentorship"> Select Mentor </Link>,
        body: <React.Fragment>
            Select a mentor to help you with university admissions, getting an internship, immigrating as an international student.
        </React.Fragment>,
        // commenting out instead of deleting images because might use them again soon
        image: "https://i.imgur.com/JiXAi2L.png",
        // gif: "https://s3.gifyu.com/images/create-account.gif"
    },
    {
        title: "Prepare for Mentor",
        body: <React.Fragment>
            Tell your mentor your goals for the session. Mentor prepares a mentorship package with advice for you.
            <a href={mentorshipPackageExample} target="_blank" rel="noreferrer">Sample mentorship package</a>
        </React.Fragment>,
        image: "https://i.imgur.com/FBZWBuV.png",
        // gif: "https://s3.gifyu.com/images/My-Movie-4.gif"

    },
    {
        title: "Meet with Mentor",
        body: <React.Fragment>
            Meet with Mentor virtually to go over mentorship package, advice, ask questions and get answers.
        </React.Fragment>,
        image: "https://i.imgur.com/S0gu4Vn.png"
    }
];


export function HowItWorksMentee() {

    return (
        <div className="container">

            <h1 className="col-sm-12 text-center">
                <Link to="/mentorship"> How to Get Mentored with Atila </Link>
            </h1>

            <h2 className="col-sm-12 text-center">
                1. Select Mentor.{' '}
                2. Prepare for Mentor.{' '}
                3. Meet Mentor.
            </h2>

            <div>
            <DescriptionsWithScreenshotsList items={howItWorksMentee} />
            </div>


            <h1 className="col-sm-12 text-center">
                <Link to="/mentorship/about"> Learn more </Link>
            </h1>
            
            <Button type="primary" className="font-size-larger col-12 my-3" style={{fontSize: "25px"}}>
                <Link to="/register?type=sponsor">
                    Get Started
                </Link>
            </Button>
            <hr />

            <Button type="secondary" className="font-size-larger col-12 my-3" style={{fontSize: "25px"}}>
                <Link to="/register?type=mentor">
                    Become a mentor
                </Link>
            </Button>

        </div>
    )
}

const howItWorksStudent = [
    {
        title: "Find Scholarships",
        body: <React.Fragment>
            Get matched with scholarships based on your school, program, extracurricular activities, future career and more.
        </React.Fragment>,
        // commenting out instead of deleting images because might use them again soon
        image: "https://i.imgur.com/MZoyXgJ.png",
        gif: "https://s3.gifyu.com/images/create-account.gif"
    },
    {
        title: "Apply for Scholarships",
        body: <React.Fragment>
            Apply for multiple scholarships all from one platform and easily reuse your past answers to save time.
            {/* TODO uncomment this line when we add this feature */}
            {/* Autofill similar responses used in past scholarships to save time. */}
        </React.Fragment>,
        image: "https://i.imgur.com/qw9Zz7o.png",
        gif: "https://s3.gifyu.com/images/My-Movie-4.gif"

    },
    {
        title: "Get Funded",
        body: <React.Fragment>
            Accept scholarship award through Atila portal. Scholarship funds are deposited to your account within 1-3 days.
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
        image: "https://imgur.com/HgIoMJ9.jpg",
        gif: "https://s3.gifyu.com/images/Add-A-Scholarship-Final-Gif.gif"
    },
    {
        title: "Fund Scholarship",
        body: <p>Fund the scholarship with a credit card or debit card.
            <br/><br/>
            The minimum funding amount for a scholarship is just ${Currencies.CAD.minimum_funding_amount_contribute_new_award}. <br/> <br/>
            The minimum funding amount for additional contributions is ${Currencies.CAD.minimum_funding_amount_contribute_scholarship}.
        </p>,
        image: "https://i.imgur.com/kgpSskJ.png",
        gif: "https://s3.gifyu.com/images/Add-Scholarship_-Michael-Scott-Scotts-Tots-Scholarship-2021---Atila--Mozilla-Firefox-2021-05-04-10-15-30.gif"
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
        gif: "https://s3.gifyu.com/images/The-Office-Fund-2021-application-management---Atila--Mozilla-Firefox-2021-05-04-11-07-47.gif"
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
                <Link to="/register">Find Scholarships.</Link>{' '}
                <Link to="/scholarship">Apply for Scholarships.</Link>{' '}
                <Link to="/finalists">Get Funded.</Link>{' '}
            
            </h2>
            <h5 className="col-sm-12 text-center text-muted">Atila is 100% free for students</h5>
            <div className="offset-lg-1">

                <DescriptionsWithScreenshotsList items={howItWorksStudent} />
            </div>

            <EmbedResponsiveYoutubeVideo youtubeVideoId="iLIHhuY9b0k" title="How to Start a Scholarship on Atila" />

            <h1 className="col-sm-12 text-center">
                <Link to="/apply"> Learn More </Link>
            </h1>
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
            <EmbedResponsiveYoutubeVideo />
            }
            <div>
            <DescriptionsWithScreenshotsList items={howItWorksSponsorItems} />
            </div>

            {/*Hide Learn More is true on the /start page. Which is when we want to show the demo first
            Otherwise, when used elsewhere, we want to show the demo after the screenshots*/}
            {!hideLearnMore &&
                <EmbedResponsiveYoutubeVideo />
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
                <DescriptionWithScreenshot item={item} index={index} key={index} />
            ))}
        </div>
    )
}

export function DescriptionWithScreenshot({item, index=null})   {

    return (
        <React.Fragment key={item.title}>
            <div className="card shadow m-3 p-3 col-lg-4 col-sm-12">
                <h3 className="m-3 text-muted strong">
                    {index !== null ? `${index+1}. ` : null} {item.title}
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
import React from 'react';
import {Link} from "react-router-dom";
import {Tag} from "antd";

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

            Tell us your school, program, ethnicity, gender, etc. to get matched
            with the right scholarships for you.

        </React.Fragment>,
        image: "https://imgur.com/QSmRBwv.jpg"
    },
    {
        title: "Apply for Scholarships",
        body: <React.Fragment>
            Apply for multiple scholarships all from one site.
            Autofill similar responses used in past scholarships to save time.
        </React.Fragment>,
        image: "https://imgur.com/a49KkBZ.jpg"

    },
    {
        title: "Get Funded",
        body: <React.Fragment>
            Scholarship funding is directly deposited to your bank account
            within 7 days of accepting award<sup>*</sup>.
            <br/>
            <small>
                <sup>*</sup>
            Only currently available for students with Canadian Bank Accounts.
            </small>
        </React.Fragment>,
        image: "https://imgur.com/1HufdyP.jpg"
    }
 ];


function HowItWorksStudent() {

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
            <div className="offset-lg-1">

                <DescriptionsWithScreenshots items={howItWorksStudent} />

                <h1 className="col-sm-12 text-center">
                    <Link to="/apply"> Learn More </Link>
                </h1>
            </div>
        </div>
    )
}

function HowItWorksSponsor() {

    const howItWorksSponsorItems = [
        {
        title: "Create Scholarship",
        body: <React.Fragment>
        Enter details about the scholarship: <br/>
        What inspired you to start it?{' '}
            When's the deadline?{' '}
            Who's eligible?{' '}
            Any short answer or essay questions?{' '} etc.
        </React.Fragment>,
            image: "https://imgur.com/Bqo8XfQ.jpg"
        },
        {
        title: "Fund Scholarship",
        body: "Fund the scholarship with a credit card or debit card.",
            image: "https://imgur.com/qekOq3D.jpg",
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
            "on behalf of the scholarship sponsor for free.",
        image: "https://i.imgur.com/6p5wMBm.jpeg",
        imageCaption: <React.Fragment>
            Source: <a href="https://lasentinel.net/dulans-restaurants-help-dorsey-grad-attend-howard-university.html"
                       target="_blank"
                       rel="noopener noreferrer">
            LA Sentinel
        </a>
            <br/>
            <small>Note: This is just an example.
                Atila has no affiliation with the scholarship shown above.</small>
        </React.Fragment>
        },
    ];

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
            <div>
            <DescriptionsWithScreenshots items={howItWorksSponsorItems} />
            </div>


            <h1 className="col-sm-12 text-center">
                <Link to="/start"> Learn more </Link>
            </h1>
        </div>
    )
}

function DescriptionsWithScreenshots({items})   {

    return (
        <div className="row">
            {items.map( (item, index) => (
                <React.Fragment>
                    <div className="card shadow m-3 p-3 col-lg-4 col-sm-12">
                        <h3 className="m-3 text-muted strong">
                            {index+1}. {item.title}
                        </h3>
                        <p className="m-3">
                            {item.body}
                        </p>
                    </div>
                    <div className="card shadow m-3 p-3 col-lg-7 col-sm-12">

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

                </React.Fragment>
            ))}
        </div>
    )
}
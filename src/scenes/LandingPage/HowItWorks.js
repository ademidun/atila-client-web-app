import React from 'react';
import {Link} from "react-router-dom";
import createProfileGif from './assets/create-profile.gif';
import registrationGif from './assets/registration.gif';
import viewScholarshipsGif from './assets/view-scholarships.gif';
import scholarshipManagement from "./assets/scholarshipManagement.png";
import {Col, Row} from "antd";

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

function HowItWorksStudent() {

    return (
        <div className="container">
            <h1 className="col-sm-12 text-center">
                <Link to="/blog/atila/what-is-atila"> How Atila Works: Student </Link></h1>
            <h2 className="col-sm-12 text-center">
                <Link to="/register">Make an account.</Link>{' '}
                <Link to="/scholarship">Find Scholarships.</Link>{' '}
                Apply </h2>
            <div className="offset-lg-1">
                <div className="row">
                    <div className="card shadow m-3 p-5 col-lg-4 col-sm-12">
                        <h3>1. Make an Account
                            <span role="img" aria-label="finger pointing upwards emoji">
                                👆🏽
                            </span>
                        </h3>
                        <p><Link to="register">Register</Link> for a free account in 15 seconds.</p>
                    </div>
                    <div className="card shadow m-3 p-3 col-lg-7 col-sm-12">

                        <img src={registrationGif} id="registration-gif"
                             alt="Atila Registration Walkthrough" title="Atila Registration Walkthrough"
                             className="landing-page-gif landing-page-gif-desktop"/>
                    </div>
                </div>
                <div className="row">
                    <div className="card shadow m-3 p-5 col-lg-4 col-sm-12">
                        <h3>2. Create Your Profile
                            <span role="img" aria-label="female emoji">
                            🙎🏾‍♀️
                            </span>
                        </h3>
                        <p>Tell us the schools and programs you're interested in.</p>
                    </div>
                    <div className="card shadow m-3 p-3 col-lg-7 col-sm-12">

                        <img src={createProfileGif} id="create-profile-gif"
                             alt="Create Your Profile" title="Create Your Profile"
                             className="landing-page-gif landing-page-gif-mobile"/>
                    </div>
                </div>
                <div className="row">
                    <div className="card shadow m-3 p-5 col-lg-4 col-sm-12">
                        <h3>
                            3. Find Your Scholarships
                        </h3>
                        <p>Get matched with scholarships that are customized just for you based on your profile.</p>
                    </div>
                    <div className="card shadow m-3 p-3 col-lg-7 col-sm-12">

                        <img src={viewScholarshipsGif} id="view-scholarships-gif"
                             alt="Find Your Scholarships" title="Find Your Scholarships"
                             className="landing-page-gif landing-page-gif-mobile"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function HowItWorksSponsor() {

    const howItWorksItems = [
        {
        title: "Create your scholarship",
        body: "Select the funding amount, eligibility requirements and details about scholarship",
        image: scholarshipManagement,
        },
        {
        title: "Fund Your Scholarship",
        body: "Directly fund the scholarship amount online",
            image: scholarshipManagement,
        },
        {
        title: "Review Applications",
        body: "Review student applications, select winner, funds directly transferred to winner.",
        image: scholarshipManagement,
        },
    ];

    return (
        <div className="container">

            <h1 className="col-sm-12 text-center">
                <Link to="/sponsor"> How Atila Works: Sponsor </Link>
            </h1>
            <Row gutter={24}>
                {howItWorksItems.map( item => (
                    <Col span={8} className="card shadow" style={{height: "400px"}}>
                        <h3 className="m-3 text-muted strong">
                            {item.title}
                        </h3>
                        <p>
                            {item.body}
                        </p>
                        <img src={item.image}
                             alt={item.title} title={item.title}
                            style={{width: "75%", height: "auto"}}/>

                    </Col>
                ))}
            </Row>
        </div>
    )
}
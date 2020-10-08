import React from "react";
import HelmetSeo from "../../components/HelmetSeo";
import {Link} from "react-router-dom";

function HowToApplyForScholarships() {

    const presentationDescription = 'This is a presentation for high school students' +
        ' about your life after high school: what are your options, ' +
        'how to learn what path is best for you and how can they achieve your goals.';
    const seoContent = {
        title: 'How to Apply for Scholarships',
        description: presentationDescription,
        image: 'https://i.ytimg.com/vi/bpyEWzblFrU/maxresdefault.jpg',
        slug: '/high-school'
    };

    return (
        <React.Fragment>
            <HelmetSeo content={seoContent} />
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>How to Apply for Scholarships</h1>
                    <h5 className="text-center">
                        <Link to="/start">
                            Interested in how to start a scholarship?
                        </Link>
                    </h5>

                    <ol>
                        <li>Create your profile to find scholarships you qualify for.<br /><br /></li>
                        <li>Apply for a scholarship, save time by pre-filling similar responses you&rsquo;ve entered in the past.<br /><br /></li>
                        <li>If selected, write a thank you email to the sponsor<br /><br /></li>
                        <li>Connect your bank Account<br /><br /></li>
                        <li>Accept payment and have funds deposited in bank account within 24 hours</li>
                    </ol>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HowToApplyForScholarships;
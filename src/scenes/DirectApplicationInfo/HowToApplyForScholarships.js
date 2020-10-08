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
                </div>
            </div>
        </React.Fragment>
    );
}

export default HowToApplyForScholarships;
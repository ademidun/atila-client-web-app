import React from "react";
import HelmetSeo from "../../components/HelmetSeo";
import {Link} from "react-router-dom";

function HowToStartAScholarship() {

    const presentationDescription = 'This is a presentation for high school students' +
        ' about your life after high school: what are your options, ' +
        'how to learn what path is best for you and how can they achieve your goals.';
    const seoContent = {
        title: 'How to Start a Scholarship',
        description: presentationDescription,
        image: 'https://i.ytimg.com/vi/bpyEWzblFrU/maxresdefault.jpg',
        slug: '/high-school'
    };

    return (
        <React.Fragment>
            <HelmetSeo content={seoContent} />
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>How to Start a Scholarship</h1>
                    <h5 className="text-center">
                        <Link to="/apply">
                            Are you a student interested in how to apply for a scholarships?
                        </Link>
                    </h5>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HowToStartAScholarship;
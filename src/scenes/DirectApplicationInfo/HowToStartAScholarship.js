import React from "react";
import HelmetSeo from "../../components/HelmetSeo";
import {Link} from "react-router-dom";
import {PricingExample} from "../Payment/Pricing";
import {BIG_CHEQUE_DISCLAIMER, SCHOLARSHIP_NETWORK_CAPTION} from "../../models/Scholarship";

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

                    <ol>
                        <li>Add your Scholarship&nbsp;</li>
                        <li>Fund Your Scholarship</li>
                        <li>Pick a winner</li>
                    </ol>
                    <p><br /><br /></p>
                    <h3>More Details</h3>
                    <p><br /><br /></p>
                    <ol>
                        <li>Atila will handle the promotion of the scholarship to various organizations</li>
                        <div className="col-12 card my-3">
                             <img src="https://i.imgur.com/a3u6UV9.png" className="center-block col-12"
                                         alt="Atila Scholarship Network - A few examples of the organizations we notify when scholarships relevant to their students are launched." />
                            <p className="col-12 text-center text-muted">
                                {SCHOLARSHIP_NETWORK_CAPTION}
                            </p>
                        </div>
                        <li>Scholarship payment: Atila will automatically handle the payment of the scholarship, distributing the funds directly to the Owner&rsquo;s bank account within 7 days of Student accepting the payment<br /><br /></li>
                        <li>We automatically email both the winners and non-winners of the scholarship, so you don&rsquo;t have to manually tell each one<br /><br /></li>
                        <li>Bonus!:For scholarships valued at $5,000 or more we mail a complimentary big cheque to the Scholarship recipient on behalf of the donor at no extra cost to you</li>
                    </ol>
                    <div className="col-12">
                        <img src="https://i.imgur.com/6p5wMBm.jpeg" className="center-block col-lg-8 col-md-12 my-3"
                             alt="Atila Scholarship Network - A few examples of the organizations we notify when scholarships relevant to their students are launched." />
                        <p className="col-12 text-center text-muted">
                            {BIG_CHEQUE_DISCLAIMER}
                        </p>
                    </div>
                    <PricingExample/>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HowToStartAScholarship;
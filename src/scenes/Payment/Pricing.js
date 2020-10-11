import React from "react";
import './Pricing.scss';
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {ATILA_SCHOLARSHIP_FEE} from "../../models/Constants";




function Pricing() {

    const ATILA_SCHOLARSHIP_FEE_AS_INTEGER = Number.parseInt(ATILA_SCHOLARSHIP_FEE * 100);
    // todo generate sitemap dynamically
    const seoContent = {
        title: `Atila Pricing - Free for Students. ${ATILA_SCHOLARSHIP_FEE_AS_INTEGER}% for Scholarship sponsors.`,
        description: `Atila is free for students and Scholarship sponsors pay ${ATILA_SCHOLARSHIP_FEE_AS_INTEGER}% of the scholarship value.`,
        image: defaultSeoContent.image,
        slug: '/premium'
    };

    const helmetSeo = (<HelmetSeo content={seoContent} />);

    return (
        <React.Fragment>
            <div className="Pricing">
                {helmetSeo}
                <div className="background">
                    <div className="container">
                        <h1>Pricing</h1>
                        <h5 className="text-white text-center">
                            Atila is completely free for students. Sponsors pay {ATILA_SCHOLARSHIP_FEE_AS_INTEGER}% of the total scholarship value.
                        </h5>
                        <div className="panel pricing-table">

                            <div className="pricing-plan">
                                <img src="https://s22.postimg.cc/8mv5gn7w1/paper-plane.png
                                " alt="" className="pricing-img" />
                                <div className="pricing-plan-text">
                                <h2 className="pricing-header">Student</h2>
                                <span className="pricing-price">Free</span>
                                </div>
                                <Link to="/register" className="pricing-button">
                                    Sign up
                                </Link>
                            </div>

                            <div className="pricing-plan">
                                <img src="https://s21.postimg.cc/tpm0cge4n/space-ship.png" alt="" className="pricing-img" />
                                <div className="pricing-plan-text">
                                <h2 className="pricing-header-last"> Scholarship Sponsors</h2>
                                <span className="pricing-price">{ATILA_SCHOLARSHIP_FEE_AS_INTEGER}%</span>
                                <li className="pricing-features-item">
                                    of total scholarship value
                                </li>
                                </div>
                                <Link to="/start" className="pricing-button">
                                    Start a Scholarship
                                </Link>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Pricing;
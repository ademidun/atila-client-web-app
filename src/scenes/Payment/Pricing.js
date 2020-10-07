import React from "react";
import './Pricing.scss';
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";

function Pricing() {
    // todo generate sitemap dynamically
    const seoContent = {
        title: 'Atila Pricing - Free for Students. 5% for Scholarship sponsors',
        description: 'Atila is free for students and Scholarship sponsors pay 5% of the scholarship amount.',
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
                        <div className="panel pricing-table">

                            <div className="pricing-plan">
                                <img src="https://s22.postimg.cc/8mv5gn7w1/paper-plane.png
                                " alt="" className="pricing-img" />
                                <h2 className="pricing-header">Student</h2>
                                <span className="pricing-price">Free</span>
                                <Link to="/register" className="pricing-button">
                                    Sign up
                                </Link>
                                <ul className="pricing-features">
                                </ul>
                            </div>

                            <div className="pricing-plan">
                                <br/>
                                <img src="https://s21.postimg.cc/tpm0cge4n/space-ship.png" alt="" className="pricing-img" />
                                <h3 className="pricing-header-last"> Scholarship Sponsors</h3>
                                <span className="pricing-price">5%</span>
                                <li className="pricing-features-item">
                                    of total scholarship value
                                </li>
                                <Link to="/contact" className="pricing-button is-featured">
                                    Learn More
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
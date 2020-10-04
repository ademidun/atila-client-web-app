import React from "react";
import './Pricing.scss';
import {Link} from "react-router-dom";
import {Popover} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import {ATILA_POINTS_EXPLAIN_POPOVER} from "../../components/AtilaPointsPaywallModal";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {PREMIUM_PRICE_BEFORE_TAX} from "./PaymentSend/PaymentSendForm";
import MoreFeatures from "../LandingPage/MoreFeatures";

function Pricing() {
    // todo generate sitemap dynamically
    const seoContent = {
        title: 'Atila Pricing - $9/month',
        description: 'Get a premium student membership to Atila starting at just $9/month',
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
                                <img src="https://s28.postimg.cc/ju5bnc3x9/plane.png" alt="" className="pricing-img" />
                                <h2 className="pricing-header">Student Premium</h2>
                                <span className="pricing-price">${PREMIUM_PRICE_BEFORE_TAX}</span>
                                <Link to="/premium" className="pricing-button is-featured">
                                    Sign Up
                                </Link>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">If you find Atila useful,
                                        support Atila with a $9/month membership.</li>
                                    <li className="pricing-features-item">You can cancel anytime.</li>
                                </ul>
                            </div>


                            <div className="pricing-plans">
                                <br/>
                                <img src="https://s21.postimg.cc/tpm0cge4n/space-ship.png" alt="" className="pricing-img" />
                                <h3 className="pricing-header-last"> Schools or Organizations</h3>
                                <span className="pricing-price">Contact</span>
                                <Link to="/contact" className="pricing-button is-featured">
                                    Get Estimate
                                </Link>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">
                                        Get a discounted rate on Atila memberships
                                        for students in your school or organization
                                    </li>
                                </ul>
                            </div>
                            

                        </div>

                        <div className="m-3 col-md-8 offset-md-4">
                            Prices represent monthly subscription  <hr/><br/>

                            Free Student Plans can access Student Premium features by adding scholarships
                            and getting <Popover content={ATILA_POINTS_EXPLAIN_POPOVER}
                                                 title="What is Atila Points?">
                    <span className="btn-link">
                        Atila Points <FontAwesomeIcon icon={faQuestionCircle} />
                    </span>
                        </Popover>  <hr/><br/>

                        </div>

                    </div>
                </div>
            </div>

            <h1 className="text-reset">Premium Features</h1>
            <MoreFeatures title={null} />
        </React.Fragment>
    );
}

export default Pricing;
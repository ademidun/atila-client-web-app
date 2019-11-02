import React from "react";
import './Pricing.scss';
import {Link} from "react-router-dom";
import {Popover} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import {ATILA_POINTS_EXPLAIN_POPOVER} from "../../components/AtilaPointsPaywallModal";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {PREMIUM_PRICE_BEFORE_TAX} from "./PremiumCheckoutForm";

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
        <div className="Pricing">
            {helmetSeo}
            <div className="background">
                <div className="container">
                    <h1>Pricing</h1>
                    <div className="panel pricing-table">

                        <div className="pricing-plan">
                            <img src="https://s28.postimg.cc/ju5bnc3x9/plane.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Student</h2>
                            <span className="pricing-price">Free</span>
                            <Link to="/register" className="pricing-button">
                                Sign up
                            </Link>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">10 scholarship views per month</li>
                                <li className="pricing-features-item">3 essay views per month</li>
                                <li className="pricing-features-item">5 blog views per month</li>
                                <li className="pricing-features-item">bi-weekly scholarship newsletter</li>
                            </ul>
                        </div>

                        <div className="pricing-plan shadow">
                            <img src="https://s21.postimg.cc/tpm0cge4n/space-ship.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Student Premium</h2>
                            <span className="pricing-price">${PREMIUM_PRICE_BEFORE_TAX}</span>
                            <Link to="/premium" className="pricing-button is-featured">
                                Sign Up
                            </Link>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">Unlimited scholarship views</li>
                                <li className="pricing-features-item">Unlimited essay views</li>
                                <li className="pricing-features-item">Unlimited blog views</li>
                                <li className="pricing-features-item">Weekly scholarship newsletter</li>
                                <li className="pricing-features-item">
                                    Get notified before your scholarships are due
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
    );
}

export default Pricing;
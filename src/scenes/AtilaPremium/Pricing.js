import React from "react";
import './Pricing.scss';
import {Link} from "react-router-dom";
import {Popover} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import {ATILA_POINTS_EXPLAIN_POPOVER} from "../../components/AtilaPointsPaywallModal";

function Pricing() {
    // todo generate sitemap dynamically
    return (
        <div className="Pricing">
            <div className="background">
                <div className="container">
                    <h1>Pricing</h1>
                    <div className="panel pricing-table">

                        <div className="pricing-plan">
                            <img src="https://s22.postimg.cc/8mv5gn7w1/paper-plane.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Student</h2>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">high school, college, university students</li>
                                <li className="pricing-features-item">10 scholarship views per month</li>
                                <li className="pricing-features-item">3 essay views per month</li>
                            </ul>
                            <span className="pricing-price">Free</span>
                            <Link to="/register" className="pricing-button">
                                Sign up
                            </Link>
                        </div>

                        <div className="pricing-plan">
                            <img src="https://s28.postimg.cc/ju5bnc3x9/plane.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Student Premium</h2>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">high school, college, university students</li>
                                <li className="pricing-features-item">Unlimited scholarship views</li>
                                <li className="pricing-features-item">Unlimited essay views</li>
                            </ul>
                            <span className="pricing-price">$9</span>
                            <Link to="/premium/student" className="pricing-button is-featured">
                                Sign Up
                            </Link>
                        </div>

                        <div className="pricing-plan">
                            <img src="https://s21.postimg.cc/tpm0cge4n/space-ship.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Enterprise</h2>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">Schools and organizations</li>
                                <li className="pricing-features-item">
                                    Schools: Premium features for all students in your school, class or grade
                                </li>
                                <li className="pricing-features-item">
                                    Organizations: Offer scholarships targeted for eligible students
                                </li>
                            </ul>
                            <span className="pricing-price">$50<small><sup>*</sup></small></span>
                            <Link to="/premium/enterprise" className="pricing-button">
                                Sign up
                            </Link>
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

                        * = Schools: additional cost per student.
                        Organizations only pay $50 flat fee{' '}
                        <Link to="/contact">Contact Us</Link> for more details

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;
import React from "react";
import './Pricing.scss';
import {Link} from "react-router-dom";
import {Button} from "antd";

function Pricing() {
    // todo generate sitemap dynamically
    return (
        <div className="background">
            <div className="container">
                <h1>Pricing</h1>
                <div className="panel pricing-table">

                    <div className="pricing-plan">
                        <img src="https://s22.postimg.cc/8mv5gn7w1/paper-plane.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Personal</h2>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">Custom domains</li>
                                <li className="pricing-features-item">Sleeps after 30 mins of inactivity</li>
                            </ul>
                            <span className="pricing-price">Free</span>
                            <Link to="/register" className="pricing-button">
                                Sign up
                            </Link>
                    </div>

                    <div className="pricing-plan">
                        <img src="https://s28.postimg.cc/ju5bnc3x9/plane.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Small team</h2>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">Never sleeps</li>
                                <li className="pricing-features-item">Multiple workers for more powerful apps</li>
                            </ul>
                            <span className="pricing-price">$9</span>
                        <Link to="/register" className="pricing-button is-featured">
                            Sign Up
                        </Link>
                    </div>

                    <div className="pricing-plan">
                        <img src="https://s21.postimg.cc/tpm0cge4n/space-ship.png" alt="" className="pricing-img" />
                            <h2 className="pricing-header">Enterprise</h2>
                            <ul className="pricing-features">
                                <li className="pricing-features-item">Dedicated</li>
                                <li className="pricing-features-item">Simple horizontal scalability</li>
                            </ul>
                            <span className="pricing-price">$50</span>
                            <Link to="/register" className="pricing-button">
                            Sign up
                        </Link>
                    </div>

                </div>

                <p className="m-3 pricing-header">
                    Prices represent monthly subscription
                </p>
            </div>
        </div>
    );
}

export default Pricing;
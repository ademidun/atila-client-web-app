import React from "react";
import './Pricing.scss';
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {ATILA_SCHOLARSHIP_FEE, Currencies} from "../../models/ConstantsPayments";


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
                            Atila is free for students. Sponsors pay {ATILA_SCHOLARSHIP_FEE_AS_INTEGER}% of the total scholarship value.
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

                <div className="container-mt-1">
                    <div className="card shadow p-3">
                        <PricingExample />

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Pricing;

export function PricingExample() {


    return (
        <div className="p-lg-3">
            <h3><Link to="/pricing">Pricing</Link> Example</h3>
            <div>
                <p>
                    Here is an example to understand the pricing structure for Atila:
                </p>
                <ol>
                    <li>
                        Rupam starts a $1,000 scholarship to support any student that comes from a single parent family.
                        <br />
                        <br />
                    </li>
                    <li>
                        Rupam pays the following:
                    </li>
                    <ol>
                        <li>
                            Scholarship Amount + 9% Atila fee + (13% HST)
                        </li>
                    </ol>
                    <li>
                        Suppose Jasleen is the recipient of the award:&nbsp;
                    </li>
                    <ol>
                        <li>
                            Rupam (the sponsor) pays $1,101.70.
                        </li>
                        <li>
                            Jasleen the (recipient) receives the full $1,000.&nbsp;
                        </li>
                        <li>
                            Atila receives $90.00&nbsp;
                        </li>
                        <li>
                            Tax paid is $11.70
                        </li>
                    </ol>
                </ol>
                <p>
                    <br />
                    <br />
                    <br />
                </p>
                <table className="table table-responsive border-sm-light">
                    <tbody>
                    <tr>
                        <td>
                            <p>
                                Name
                            </p>
                        </td>
                        <td>
                            <p>
                                Amount
                            </p>
                        </td>
                        <td>
                            <p>
                                Description
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Scholarship Amount
                            </p>
                        </td>
                        <td>
                            <p>
                                $1,000.00
                            </p>
                        </td>
                        <td>
                            <p>
                                Sponsor picks the value: <br/>
                                ${Currencies.CAD.minimum_funding_amount_contribute_new_award} minimum to start
                                a scholarship or ${Currencies.CAD.minimum_funding_amount_contribute_scholarship}
                                {' '}minimum to contribute to an existing scholarship.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Atila Fee
                            </p>
                        </td>
                        <td>
                            <p>
                                $90.00
                            </p>
                        </td>
                        <td>
                            <p>
                                9%
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Atila Fee Tax
                            </p>
                        </td>
                        <td>
                            <p>
                                $11.70
                            </p>
                        </td>
                        <td>
                            <p>
                                13% HST
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Sponsor Pays
                            </p>
                        </td>
                        <td>
                            <p>
                                $1,101.70
                            </p>
                        </td>
                        <td>
                            <p>
                                Total
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                        <td>
                            <p>
                              {' '}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Student Receives
                            </p>
                        </td>
                        <td>
                            <p>
                                $1,000.00
                            </p>
                        </td>
                        <td>
                            <p>
                                Student receives full Scholarship Amount
                            </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="container">
                    <div className="card shadow p-3">
                        <img src="https://i.imgur.com/qeovalb.png" alt="Atila Pricing Diagram" className="pricing-img"/>
                    </div>
                </div>
            </div>
        </div>
    )

}
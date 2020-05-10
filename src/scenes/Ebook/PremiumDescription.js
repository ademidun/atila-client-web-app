import React from "react";
import {Button, Col, Row} from "antd";
import {Link} from "react-router-dom";
import {FREE_PREVIEW_EMAIL, FREE_PREVIEW_LICENSE_KEY} from "../EbookPremium/EbookPremiumBanner";

export default function PremiumDescription() {


    return (
        <div className="PremiumDescription container mt-5">
            <div className="card shadow p-3">
                <h1>Ebook Features</h1>
                <div className="text-center">
                    <img
                        className="responsive-images"
                        src='https://i.imgur.com/RLc5YPU.png' alt='Book cover' />
                </div>
                <div className="my-3">
                    <ol>
                        <li>
                            Access to Premium Portal containing 15 interactive graphics (new graphs added weekly)
                        </li>
                        <li>
                            150 Page ebook available in PDF and EPUB
                        </li>
                        <li>
                            Receive Free updates to the book until August 2020
                        </li>
                    </ol>
                    <div className="text-center">
                        <Row gutter={16}>
                            <Col sm={24} md={12} className="mb-3">
                                <Button type="primary">
                                    <Link to="schools/premium">
                                        Login to Premium Portal
                                    </Link>
                                </Button>
                            </Col>
                            <Col sm={24} md={12}>
                                <Button type="primary">
                                    <Link
                                        to={`schools/premium?email=${FREE_PREVIEW_EMAIL}&licenseKey=${FREE_PREVIEW_LICENSE_KEY}`}>
                                        Premium Portal - Free Preview
                                    </Link>
                                </Button>
                            </Col>
                        </Row>


                    </div>

                </div>

            </div>
        </div>
    );
}
import React from "react";
import {Button, Col, Row} from "antd";
import {Link} from "react-router-dom";

export default function PremiumDescription() {


    return (
        <div className="PremiumDescription container mt-5">
            <div className="card shadow p-3">
                <h1>Ebook Features</h1>

                <img
                    className="responsive-images"
                    src='https://i.imgur.com/Yr0CZL2.jpg' alt='Book cover' />
                <div className="my-3">
                    <ol>
                        <li>
                            Access to over 25 interactive graphics
                        </li>
                        <li>
                            Access to 10 filterable and sortable tables containing our primary data.
                        </li>
                        <li>
                            150 Page ebook available in PDF and EPUB
                        </li>
                        <li>
                            Receive Free updates of new videos, data, and content for the next 4 months
                        </li>
                    </ol>
                    <div className="text-center">
                        <Row gutter={16}>
                            {['Preview Premium Portal', 'Login'].map( text => (
                                <Col key={text} span={12}>
                                    <Button type="primary">
                                        <Link to="schools/premium">
                                            {text}
                                        </Link>
                                    </Button>
                                </Col>
                            ))}
                        </Row>


                    </div>

                </div>

            </div>
        </div>
    );
}
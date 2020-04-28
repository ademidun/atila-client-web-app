import React from "react";
import {Button, Col, Row} from "antd";
import {Link} from "react-router-dom";

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
                            {['Login to Premium Portal'].map( text => (
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
import { Button, Col, Row } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import "./Crypto.scss";

function Crypto() {

    const onboardOptions = [
        {
            title: "Apply for a crypto scholarship",
            internal_link: "/scholarship/s/crypto"
        },
        {
            title: "Start a crypto scholarship",
            internal_link: "/scholarship/add?is_crypto=true"
        },
        {
            title: "Contribute to a crypto scholarship",
            internal_link: "/scholarship/s/crypto"
        },
        {
            title: "Practice first with test crypto",
            url: "https://demo.atila.ca/crypto"
        },
    ]

    const title = "Start and get scholarships using cryptocurrencies";
    const seoContent = {
        ...defaultSeoContent,
        title,
    }
  return (
    <div className="Crypto container card shadow mt-5 pt-5">
        <HelmetSeo content={seoContent} />
        <h1>{title}</h1>
        <hr />

        <div className="card shadow m-5 p-3">
            <h1>
                I want to...
            </h1>
            <Row gutter={[24, 24]}>
               {onboardOptions.map(option => 
                <Col xs={24} sm={24} md={6} key={option.title}>
                    <Button>
                        {option.url && <a href={option.url} target="_blank" rel="noopener noreferrer">{option.title}</a>}
                        {option.internal_link && <Link to={option.internal_link}>{option.title}</Link>}
                    </Button>
                </Col>
                
                )}
            </Row>

        </div>
        <div className="card shadow m-5 p-3">
            <h1>
                List of available crypto scholarships
            </h1>
        </div>
        <div className="card shadow m-5 p-3">
            <h1>
                How it works
            </h1>
        </div>
        <div className="card shadow m-5 p-3">
            <h1>
                Educational resources
            </h1>
        </div>
    </div>
  )
}

export default Crypto
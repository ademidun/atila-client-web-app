import { Button, Col, Row } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import NotionPage from '../../components/Notion/NotionPage';
import Environment from '../../services/Environment';
import "./Crypto.scss";

function Crypto() {


    const isDemoMode = Environment.name !== "prod";

    const cryptoDemoUrl = "https://demo.atila.ca/crypto";
    const cryptoProdUrl = "https://atila.ca/crypto";
    let onboardOptions = [
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
            title: isDemoMode ? "Use real crypto" :  "Practice first with test crypto",
            url: isDemoMode ? cryptoProdUrl : cryptoDemoUrl,
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

        <div className="section card shadow">
            <h1>
                I want to...
            </h1>
            <Row gutter={[24, 24]}>
               {onboardOptions.map(option => 
                <Col xs={24} sm={24} md={6} key={option.title}>
                    <Button className='shadow'>
                        {option.url && <a href={option.url} target="_blank" rel="noopener noreferrer">{option.title}</a>}
                        {option.internal_link && <Link to={option.internal_link}>{option.title}</Link>}
                    </Button>
                </Col>
                
                )}
            </Row>

        </div>
        <div className="section card shadow">
            <h1>
                Crypto scholarships
            </h1>
        </div>
        <div className="section card shadow">
            <h1>
                How it works
            </h1>

            <NotionPage pageId="60119453e2564fe0b5cc6e6fa05984a2" showTableOfContents={false} className="p-2" />
        </div>
        <div className="section card shadow">
            <h1>
                Educational resources
            </h1>
        </div>
    </div>
  )
}

export default Crypto
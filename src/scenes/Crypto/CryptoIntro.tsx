import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../../components/Loading';
import NotionPage from '../../components/Notion/NotionPage';
import { Scholarship } from '../../models/Scholarship.class';
import Environment from '../../services/Environment';
import ScholarshipsAPI from '../../services/ScholarshipsAPI';
import ScholarshipCard from '../Scholarship/ScholarshipCard';
function CryptoIntro() {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loadingScholarships, setLoadingScholarships] = useState(false);

    useEffect(() => {
      loadScholarships();
    }, [])

    const loadScholarships = () => {
        setLoadingScholarships(true);
        ScholarshipsAPI.list('?is_crypto=true')
        .then(res => {
            setScholarships(res.data.results);
        })
        .catch(err=>{
            console.log(err);
        })
        .finally(() => {
            setLoadingScholarships(false);
        })
    }
    
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
  return (
    <div>
        <div className="section card shadow call-to-action">
            <h1>
                I want to...
            </h1>
            <Row gutter={[24, 24]}>
               {onboardOptions.map(option => 
                <Col xs={24} sm={24} md={6} key={option.title} className="d-flex">
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
            {loadingScholarships && <Loading title="Loading Scholarships" />}
            <Row gutter={[12, 12]}>
               {scholarships.map(scholarship => 
                <Col xs={24} sm={24} md={12} lg={8} key={scholarship.id}>
                    <ScholarshipCard scholarship={scholarship} isOneColumn={true}/>
                </Col>
            )}
            </Row>
        </div>
        <div className="section card shadow">
            <h1>
                How it works
            </h1>

            <NotionPage pageId="60119453e2564fe0b5cc6e6fa05984a2" showTableOfContents={false} className="p-2" />
        </div>
    </div>
  )
}

export default CryptoIntro
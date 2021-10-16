import React from 'react';
import {Link} from "react-router-dom";
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';

function Resources(){


    const title: string = 'Scholarship resources for Students and Teachers';
    const seoContent = {
        ...defaultSeoContent,
        title,
        description: 'A list of resources to help you get scholarships.',
    };

    return (
        <div className="container mt-5">
            <HelmetSeo content={seoContent} />
            <div className="card shadow p-3">
                <h1>{title}</h1>
                
                <p>Do you want us to speak to your students about scholarships? <Link to="/contact">Contact Us</Link>
                </p>
            </div>
        </div>
    );

}

export default Resources;


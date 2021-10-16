import React from 'react';
import {Link} from "react-router-dom";
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';

function Resources(){


    const title: string = 'Scholarship resources for Students';
    const seoContent = {
        ...defaultSeoContent,
        title,
        description: 'A list of resources to help you get scholarships.',
    };

    const presentationId = "2PACX-1vR2yzK_cDJBfuVPnuf-6MBYlJBNgfZOTKj6zZ69Nw3vN-r1k0uBbq5P-JuhGtXdHLCdx9uEUqcbpqmi";
    return (
        <div className="container mt-5">
            <HelmetSeo content={seoContent} />
            <div className="card shadow p-3 text-center">
                <h1>{title}</h1>

                <h3>
                    <a href={`https://docs.google.com/presentation/d/e/${presentationId}/pub?start=false&loop=false&delayms=3000`}>
                        How to get Scholarships Presentation
                    </a>
                </h3>
                <div className="responsive-google-slides">
                  <iframe 
                    title="How to get Scholarships Presentation"
                    src={`https://docs.google.com/presentation/d/e/${presentationId}/embed?start=false&loop=false&delayms=3000`}></iframe>
                </div>
                <hr/>

                
                <p>Do you want us to speak to your class about scholarships? <Link to="/contact">Contact Us</Link>
                </p>
            </div>
        </div>
    );

}

export default Resources;


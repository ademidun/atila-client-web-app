import React from 'react';
import {DescriptionsWithScreenshots} from "../scenes/LandingPage/HowItWorks";
import HelmetSeo, {defaultSeoContent} from "./HelmetSeo";
import Team from "./Team/Team";
import ImageGallery from "react-image-gallery";

function Rubric() {
    const seoContent = {
        ...defaultSeoContent,
        title: 'Atila Rubric - How Atila Scores Scholarship Applications'
    };
    return (

        <div className="container">
            <HelmetSeo content={seoContent}/>
            <h1 className="col-sm-12 text-center">
                Atila Rubric - How Atila Scores Scholarship Applications
            </h1>
        </div>
    )
}

export default Rubric;
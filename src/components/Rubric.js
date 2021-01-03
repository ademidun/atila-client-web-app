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

            <div className="card shadow">


                <table className="table table-responsive border-sm-light">
                    <tbody>
                    <tr>
                        <td>0-3</td>
                        <td>4-6</td>
                        <td>7-8</td>
                        <td>9-10</td>
                    </tr>
                    <tr>
                        <td>Grammar</td>
                        <td>grammatical mastery; text is rigorously edited for grammar and punctuation</td>
                    </tr>
                    <tr>
                        <td>Personal</td>
                    </tr>
                    <tr>
                        <td>Accomplishments</td>
                    </tr>
                    <tr>
                        <td>Goals</td>
                    </tr>
                    <tr>
                        <td>
                            <p>Community Impact</p>
                        </td>
                    </tr>
                    <tr>
                        <td>Extras</td>
                    </tr>
                    <tr>
                        <td>Creativity*</td>
                    </tr>
                    <tr>
                        <td>Craftsmanship*</td>
                    </tr>
                    </tbody>
                </table>
                <p>* These criteria are usually only used for applications that require a creative element</p>
                <p>Sources:</p>
                <ol>
                    <li><a href="https://rubysrainbow.org/rubrics/" target="_blank" rel="noopener noreferrer" data-stringify-link="https://rubysrainbow.org/rubrics/" data-sk="tooltip_parent">https://rubysrainbow.org/rubrics/</a></li>
                    <li><a href="https://rubysrainbow.org/wp-content/uploads/2020-Rubric-Regular.jpg" target="_blank" rel="noopener noreferrer" data-stringify-link="https://rubysrainbow.org/wp-content/uploads/2020-Rubric-Regular.jpg" data-sk="tooltip_parent">https://rubysrainbow.org/wp-content/uploads/2020-Rubric-Regular.jpg</a></li>
                    <li><a href="https://aquinascollege.edu/wp-content/uploads/Write-Reason-Rubric.pdf" target="_blank" rel="noopener noreferrer" data-stringify-link="https://aquinascollege.edu/wp-content/uploads/Write-Reason-Rubric.pdf" data-sk="tooltip_parent">https://aquinascollege.edu/wp-content/uploads/Write-Reason-Rubric.pdf</a></li>
                    <li><a href="https://www.kpu.ca/sites/default/files/NEVR/High%20School%20Rubrics.pdf" target="_blank" rel="noopener noreferrer" data-stringify-link="https://www.kpu.ca/sites/default/files/NEVR/High%20School%20Rubrics.pdf" data-sk="tooltip_parent">https://www.kpu.ca/sites/default/files/NEVR/High%20School%20Rubrics.pdf</a></li>
                    <li><a href="https://blog.submittable.com/using-rubrics-to-review-scholarship-and-fellowship-applications/" target="_blank" rel="noopener noreferrer" data-stringify-link="https://blog.submittable.com/using-rubrics-to-review-scholarship-and-fellowship-applications/" data-sk="tooltip_parent">https://blog.submittable.com/using-rubrics-to-review-scholarship-and-fellowship-applications/</a></li>
                </ol>
            </div>
        </div>
    )
}

export default Rubric;
import React from 'react';
import HelmetSeo, {defaultSeoContent} from "./HelmetSeo";
import './Rubric.scss';

function Rubric() {
    const seoContent = {
        ...defaultSeoContent,
        title: 'Atila Rubric - How Atila Scores Scholarship Applications'
    };
    return (
        <div class="mt-5">
            <div className="container">
                <HelmetSeo content={seoContent}/>
                <h1 className="col-sm-12 text-center">
                    Atila Rubric - How Atila Scores Scholarship Applications
                </h1>
                <div className="card shadow">
                    <table className="table table-responsive border-sm-light">
                        <tbody>
                        <tr>
                            <td>
                                <p></p>
                            </td>
                            <td>
                                <p>9-10</p>
                            </td>
                            <td>
                                <p>7-8</p>
                            </td>
                            <td>
                                <p>5-6</p>
                            </td>
                            <td>
                                <p>0-4</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Grammar</p>
                            </td>
                            <td>
                                <p>Grammatical mastery; text is rigorously edited for grammar and punctuation</p>
                            </td>
                            <td>
                                <p>Occasional errors; does not hinder understanding of text</p>
                            </td>
                            <td>
                                <p>Shows lack of editing; competent but contains unnecessary errors</p>
                            </td>
                            <td>
                                <p>Numerous errors in grammar, punctuation, syntax, and spelling;</p>
                                <p>Difficult to understand due to grammatical errors</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Personal</p>
                            </td>
                            <td>
                                <p>The applicant provides a complete picture of <em>relevant </em>personal experiences. It is easy to see a clear vision of the applicant&rsquo;s individuality, passion and hope for the future&nbsp;</p>
                            </td>
                            <td>
                                <p>The applicant provides information about their personal experiences. An inference can be made about the applicant&rsquo;s individuality.</p>
                            </td>
                            <td>
                                <p>The applicant provides some information about their personal experiences. Generalized or cliche anecdotes belong in this category</p>
                            </td>
                            <td>
                                <p>The applicant provides very little or distracting person experiences.&nbsp;</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Accomplishments</p>
                            </td>
                            <td>
                                <p>The applicant shares several accomplishments that demonstrates their drive, initiative, and effort</p>
                            </td>
                            <td>
                                <p>The applicant shares one accomplishment that demonstrates their drive, initiative, and effort</p>
                            </td>
                            <td>
                                <p>The applicant shares one or several accomplishments that vaguely demonstrates their drive, initiative, and effort</p>
                            </td>
                            <td>
                                <p>The applicant shares few or no accomplishments; the accomplishments shared do not prove a point</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Goals</p>
                            </td>
                            <td>
                                <p>The applicant clearly states and describes their goals. They describe how their studies and/or personality will help achieve that goal</p>
                            </td>
                            <td>
                                <p>The applicant provides information about their goals. They demonstrate ambition and drive, but might lack actionable goals</p>
                            </td>
                            <td>
                                <p>The applicant states some goals, but may not be applicable or does not incorporate their individuality in their answer.</p>
                            </td>
                            <td>
                                <p>The applicant does not have goals</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Community Impact</p>
                            </td>
                            <td>
                                <p>The applicant has made a significant impact in their community/school. They have clearly demonstrated their impact by citing programs, people, or experiences</p>
                            </td>
                            <td>
                                <p>The applicant has made a significant impact in their school, but examples provided aren&rsquo;t clear or specific.</p>
                            </td>
                            <td>
                                <p>The applicant has made an acceptable level of impact in their community/school,</p>
                            </td>
                            <td>
                                <p>The applicant did not include sufficient or relevant examples of community impact</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Creativity*</p>
                            </td>
                            <td>
                                <p>Creative use of writing techniques that clearly demonstrates the points above. Organized in a well thought-out way that is easy to follow.</p>
                            </td>
                            <td>
                                <p>Sufficient use of writing techniques that aptly demonstrates the points made. Organized so it is easy to follow</p>
                            </td>
                            <td>
                                <p>Acceptable use of writing techniques that somewhat demonstrates their points. Sentence structures are boring or repeated many times</p>
                            </td>
                            <td>
                                <p>Poor writing technique that fails to get the point across.</p>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <p>* These criteria are only used for applications that require a creative element</p>
                    <p>Sources:</p>
                    <ol>
                        <li><a href="https://rubysrainbow.org/rubrics/" target="_blank" rel="noopener noreferrer" data-stringify-link="https://rubysrainbow.org/rubrics/" data-sk="tooltip_parent">Ruby's Rainbow Rubric</a></li>
                        <li><a href="https://aquinascollege.edu/wp-content/uploads/Write-Reason-Rubric.pdf" target="_blank" rel="noopener noreferrer" data-stringify-link="https://aquinascollege.edu/wp-content/uploads/Write-Reason-Rubric.pdf" data-sk="tooltip_parent">Aquinas College Writing and Reasoning Rubric</a></li>
                        <li><a href="https://www.kpu.ca/sites/default/files/NEVR/High%20School%20Rubrics.pdf" target="_blank" rel="noopener noreferrer" data-stringify-link="https://www.kpu.ca/sites/default/files/NEVR/High%20School%20Rubrics.pdf" data-sk="tooltip_parent">Kwantlen Polytechnic University: Sample Rubric for High School</a></li>
                    </ol>
                </div>
            </div>
        </div>


    )
}

export default Rubric;
import React from 'react';
import { ImageGif } from '../../components/ImageGif';
import {Link} from "react-router-dom";


class ContactsNetworkInformation extends React.Component {

    render() {

        const descriptionGif = {
            gifUrl: "https://i.imgur.com/KBA1AqM.gif",
            title: "How Student Club Visualizer Works",
            imageUrl: "https://i.imgur.com/aKN4rVS.png"
        };

        return (
            <div>
            <div className="container mt-5">
                <div className="card shadow p-3">
                <h1>What is the Student Clubs Network Visualizer?</h1>


                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <ImageGif
                            imageUrl={descriptionGif.imageUrl}
                            gifUrl={descriptionGif.gifUrl}
                            title={descriptionGif.title}
                            defaultImageType="gif"/>
                    </div>
                </div>
                <hr/>

                <p>The Student Clubs Network Visualizer is a graph that represents different university clubs and their relationship with each other.</p>
                <p>Each icon represents an organization from a Canadian university. Click on the club icon to learn more about each club and their follower counts. We also added the ability to suggest an edit if we have incorrect or missing information.</p>
                <p>The arrows that connect the clubs represent following. Thus, the more arrows a club has pointed at it, the more followers it has.</p>
                <p>Users can search and filter by different clubs using categories such as school, program, career, activity, location, ethnicity, gender, religion etc.</p>
                <p>For Example:</p>
                <ul>
                <li><Link to="clubs?__or__eligible_schools=University+of+Toronto&__or__eligible_schools=University+of+Alberta">Get me all the clubs for students at the University of Toronto or University of Alberta</Link></li>
                <li><Link to="clubs?other_demographic=STEM&other_demographic=Women">Get me all the clubs for Women in STEM</Link></li>
                <li><Link to="clubs?__or__ethnicity=Black&__or__ethnicity=Indigenous">Get me all the clubs for Black, East-Asian, South-Asian or Indigenous students</Link></li>
                <li><Link to="clubs?eligible_programs=Medicine">Get me all the clubs for students interested in Medicine or Nursing at Humber College or Dalhousie University</Link></li>
                <li><Link to="clubs?__or__religion=Christianity&__or__religion=Judaism&__or__religion=Islam">Clubs for Christian, Jewish or Muslim students</Link></li>
                <li><Link to="clubs?__or__sports=Weightlifting&__or__sports=Basketball">Clubs for students interested weightlifting or basketball</Link></li>
                <li><Link to="clubs?__or__other_demographic=LGBTQ">Clubs for LGBTQ students</Link></li>
                <li><Link to="clubs?__or__eligible_programs=Software+Engineering&__or__industries=Investment+Banking&__or__industries=Management+Consulting">Clubs for Software Engineering, Investment Banking or Consulting</Link></li>
                </ul>
                <h3>What are some Potential Use Cases?</h3>
                <ol>
                <li><strong>Prospective students</strong> deciding on schools to attend would be interested to know all the different clubs that exist for their interests and demographics<br /></li>
                <li><strong>Current students</strong> interested to know what clubs they can join in their school or in other schools</li>
                <li><strong>Student club executives</strong> looking for other clubs that exist in their space in case they want to collaborate</li>
                <li><strong>For Profit or Non-Profit companies or organizations</strong> looking for clubs they might want to partner with for campus outreach or hiring opportunities</li>
                </ol>
                </div>
            </div>
            </div>
        );
    }
}

export default ContactsNetworkInformation;
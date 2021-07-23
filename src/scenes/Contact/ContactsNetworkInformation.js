import React from 'react';
import { ImageGif } from '../../components/ImageGif';


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
                <li>Get me all the software engineering clubs from Mcgill University</li>
                <li>Get me all the nursing or indigenous clubs from Humber College</li>
                <li>Get me all the women in business clubs from the University of British Columbia or University of Alberta</li>
                <li>Get me all the clubs for black students interested in Law</li>
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
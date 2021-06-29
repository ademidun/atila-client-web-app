import React from 'react';


class ContactsNetworkInformation extends React.Component {

    render() {

        return (
            <div>
            <div className="container mt-5">
                <div className="card shadow p-3">
                <h1>What is the Student Clubs Network Visualizer?</h1>
                <p>The Student Clubs Network Visualizer is a <a href="https://observablehq.com/@d3/force-directed-graph" target='blank'>Force Directed Graph</a> that represents different university clubs on Instagram and their relationship with one another.</p>
                <p>Each icon represents an organization from a Canadian university. Click on the club icon to learn more about each club and their follower counts. We also added the ability to suggest an edit if we have incorrect or missing information.</p>
                <p>The arrows that connect the clubs represent following. Thus, the more arrows a club has pointed at it, the more followers it has.</p>
                <p>Users can search and filter by different clubs using categories such as school, program, career, activity, location, ethnicity, gender, religion etc.</p>
                <p>For Example:</p>
                <ul>
                <li>Get me all the software engineering clubs for schools in Quebec</li>
                <li>Get me all the women in business or finance clubs in British Columbia and Alberta</li>
                <li>Get me all the clubs for black students interested in Law</li>
                </ul>
                <h3>What are some Potential Use Cases?</h3>
                <ol>
                <li>Prospective students deciding on schools to attend would be interested to know all the different clubs that exist for their interests and demographics<br /></li>
                <li>Current students would be interested to know what clubs they can join in their school or in other schools</li>
                <li>Other clubs might want to know what other clubs exist in this space in case they want to collaborate</li>
                <li>Employers would want to know what clubs they should sponsor for corporate events</li>
                </ol>
                </div>
            </div>
            </div>
        );
    }
}

export default ContactsNetworkInformation;
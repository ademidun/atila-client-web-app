import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import tomiwaImage from './assets/tomiwa.jpg';
import jacobImage from './assets/jacob.jpg';
import nikhilImage from './assets/nikhil.jpg';
import leaImage from './assets/lea.jpg';
import valentineImage from './assets/valentine.jpg';
import auroritaImage from './assets/aurorita.jpg';

const teamMembers = [
    {
        'first_name': 'Tomiwa',
        'last_name': 'Ademidun',
        'username': 'tomiwa',
        'position': 'Founder',
        'img_url': tomiwaImage,
        'description_1': 'Tomiwa is currently taking a year off a dual degree in software engineering and business at Ivey Business School in Canada to start Atila.',
        'description_2': 'He enjoys playing soccer and is a big Arsenal F.C. fan.',
        'link_type': 'Website',
        'link_url': 'http://tomiwa.ca'
    },
    {
        'first_name': 'Jacob',
        'last_name': 'Munene',
        // 'username': 'lhandal',
        'position': 'Marketing',
        'img_url': jacobImage,
        'description_1': 'Jacob is currently studying Financial Modeling and Applied Mathematics at Western University.' +
            ' He also works as a Capital reporting intern at TD.',
        'description_2': 'For fun, he enjoys working out and recording himself while doing it.',
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/jacob-munene-4561a4153/"
    },
    {
        'first_name': 'Nikhil',
        'last_name': 'Trehan',
        'username': 'nikhiltrehan',
        'position': 'Marketing',
        'img_url': nikhilImage,
        'description_1': 'Nikhil is currently a high school student at Holy Trinity School and an AI innovator at TKS.',
        'description_2': 'For fun, he enjoys following politics and writing about AI and Gene Editing.',
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/nikhil-trehan-3196b6172/"
    },
    {
        'first_name': 'Lea',
        'last_name': 'Handal',
        // 'username': 'lhandal',
        'position': 'Marketing',
        'img_url': leaImage,
        'description_1': 'Lea is currently studying business and consumer behavior at Western University.',
        'description_2': 'For fun, she likes taking pcitures with Canada Goose.',
        // "link_type": "LinkedIn",
        // "link_url": "https://ca.linkedin.com/in/matharumanpreet"
    },
    {
        'first_name': 'Valentine',
        'last_name': 'Kuznetcov',
        // 'username': 'valentine',
        'position': 'Engineering',
        'img_url': valentineImage,
        'description_1': 'Valentin studied at the Ivey Business School at Western University.',
        'description_2': 'He is currently the CFO of in-lite Outdoor Lighting NA.',
        'link_type': 'LinkedIn',
        'link_url': 'https://www.linkedin.com/in/valentin-kuznetcov/'
    },
    {
        'first_name': 'Aurorita',
        'last_name': 'Mahbub',
        'username': 'auroritam',
        'position': 'Marketing',
        'img_url': auroritaImage,
        'description_1': 'Aurorita is currently studying FIMS and MIT at Western University.',
        'description_2': 'In her free time she enjoys long walks on the beach.',
        'link_type': 'LinkedIn',
        'link_url': 'https://ca.linkedin.com/in/matharumanpreet'
    },
];

function TeamMemberCard({ teamMember }) {

    return (
        <div className="card shadow max-width-md-30 m-1 p-2">
            <div className="card-title" style={{ height: '100px' }}>
                <h4>
                {teamMember.first_name} {teamMember.last_name}
                </h4>
                <h5 className="text-muted">
                    {teamMember.position}
                </h5>
            </div>
            <div className="pb-3">
                <img
                    src={teamMember.img_url}
                    className="card-img"
                    alt={teamMember.first_name}
                />
            </div>
            {teamMember.username && <Link to={`/profile/${teamMember.username}`}>Profile</Link>}
            {teamMember.link_url && <a href={teamMember.link_url}
                                       target="_blank"
                                       rel="noopener noreferrer" >
                {teamMember.link_type}
            </a>}

            <div className="card-text">
                <p>{teamMember.description_1}</p>
                <br />
                {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                <div className="pb-3" dangerouslySetInnerHTML={{__html: teamMember.description_2}} />
            </div>
        </div>
    );
}

TeamMemberCard.propTypes = {
    teamMember: PropTypes.shape({}),
};

function Team() {
    return (
        <div className="container p-3">
            <h1>Team</h1>
            <h6 className="text-center text-muted">(past and present)</h6>
            <div className="row ml-md-5">

                {teamMembers.map(member => <TeamMemberCard key={member.first_name} teamMember={member} />)}

                <div className="col-sm-12 col-md-8 px-0 pt-3" style={{ fontSize: 'larger' }}>
                    If you would like to join the team or help out in some way,
                    <a href="mailto:info@atila.ca">send an email </a> to <a
                    href="mailto:info@atila.ca">info@atila.ca</a> with your resume and/or links to cool stuff you've
                    done.
                </div>
            </div>
        </div>
    );
}

export default Team;
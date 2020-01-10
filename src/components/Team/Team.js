import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import tomiwaImage from './assets/tomiwa.jpg';
import jacobImage from './assets/jacob.jpg';
import nikhilImage from './assets/nikhil.jpg';
import leaImage from './assets/lea.jpg';
import valentineImage from './assets/valentine.jpg';
import auroritaImage from './assets/aurorita.jpg';
import aaronImg from './assets/aaronImg.jpg'
import elaineImg from './assets/elaineImg.jpeg'
import hadiImg from './assets/hadiImg.jpg'
import isaacImg from './assets/isaacImg.jpeg'
import melissaImg from './assets/melissaImg.jpeg'
import mitchellImg from './assets/mitchellImg.jpg'
import abhiImg from './assets/abhiImg.jpeg'
import devImg from './assets/devImg.jpeg'
import { FaLinkedin } from "react-icons/fa";

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
        'first_name': 'Dev',
        'last_name': 'Pancea',
        // 'username': 'lhandal',
        'position': 'Software Developer',
        'img_url': devImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/dev-pancea-018b7116a/"
    },
    {
        'first_name': 'Mithcell',
        'last_name': 'Li',
        // 'username': 'lhandal',
        'position': 'Software Developer',
        'img_url': mitchellImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/mitchell-tz-li/"
    },
    {
        'first_name': 'Aaron',
        'last_name': 'Doerfler',
        'position': 'Marketing',
        'img_url': aaronImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/aaron-doerfler-3a2144197/"
    },
    {
        'first_name': 'Abhinit',
        'last_name': 'Patil',
        'position': 'Software Developer',
        'img_url': abhiImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/abhinit-patil/"
    },
    {
        'first_name': 'Elaine',
        'last_name': 'Yin',
        'position': 'Marketing',
        'img_url': elaineImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/elaine-yin-018a90198/"
    },
    {
        'first_name': 'Isaac',
        'last_name': 'Tang',
        'position': 'Marketing',
        'img_url': isaacImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/isaac-tang-b42a8b198/"
    },
    {
        'first_name': 'Hadi',
        'last_name': 'Al Hakeem',
        'position': 'Software Developer',
        'img_url': hadiImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/hadi-al-hakeem-24182819a/"
    },
    {
        'first_name': 'Melissa',
        'last_name': 'Wen',
        'position': 'Marketing',
        'img_url': melissaImg,
        "link_type": "LinkedIn",
        "link_url": "https://www.linkedin.com/in/melissa-wen-63aa8b198/"
    },
    {
        'first_name': 'Feyi',
        'last_name': 'Adesanya',
        'position': 'Member',
        'img_url': null,
        "link_type": "LinkedIn",
        "link_url": " "
    },
    {
        'first_name': 'Samuel',
        'last_name': 'Kahessay',
        'position': 'Member',
        'img_url': null,
        "link_type": "LinkedIn",
        "link_url": " "
    },
    {
        'first_name': 'Tyreek',
        'last_name': 'Fray',
        'position': 'Operations',
        'img_url': null,
        "link_type": "LinkedIn",
        "link_url": " "
    },

];

function TeamMemberCard({ teamMember }) {

    return (
       /* <div className="card shadow col-xl-3 col-md-6 mb-4">
            <div style={{ height: '100px' }}>
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

            
        </div>*/

        <div class="col-xl-3 col-sm-6 mb-5">
            <div class="bg-white rounded shadow py-5 px-4"><img src={teamMember.img_url} alt="" width="100" class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm" />
                <h5 class="mb-0">{teamMember.first_name} {teamMember.last_name}</h5>
                <span class="small text-uppercase text-muted">{teamMember.position}</span>
                <ul class="social mb-0 list-inline mt-3">
                    <li class="list-inline-item"><Link to={`/profile/${teamMember.username}`}>Profile</Link></li>
                    <li class="list-inline-item"><a href={teamMember.link_url} class="social-link"><FaLinkedin/></a></li>
                </ul>
            </div>
        </div>
    );
}

TeamMemberCard.propTypes = {
    teamMember: PropTypes.shape({}),
};

function Team() {
    return (
        <div className="container mt-3">
            <h1>Team</h1>
            <h6 className="text-center text-mute">(past and present)</h6>
            <br/>
            <div className="row ml-md-5">

                {teamMembers.map(member => <TeamMemberCard key={member.first_name} teamMember={member} />)}

                <div className="col-sm-12 col-md-8 px-0 pt-3" style={{ fontSize: 'larger' }}>
                    If you would like to join the team or help out in some way,
                    <a href="mailto:info@atila.ca" target="_blank" rel="noopener noreferrer">send an email </a> to <a
                    href="mailto:info@atila.ca" target="_blank" rel="noopener noreferrer">info@atila.ca</a> with your resume and/or links to cool stuff you've
                    done.
                </div>
            </div>
        </div>
    );
}

export default Team;
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import tomiwaImage from "./assets/tomiwa.jpg";
import aaronImage from "./assets/aaron.jpg";
import hadiImage from "./assets/hadi.jpg";
import { Col, Row } from "antd";
import HelmetSeo from "../HelmetSeo";
const yasithImage = 'https://i.imgur.com/XDSsPD7.jpg';

const teamMembers = [
  {
    first_name: "Tomiwa",
    last_name: "Ademidun",
    username: "tomiwa",
    position: "Founder",
    img_url: tomiwaImage,
    description_1:
      "Tomiwa is a dual degree software engineering and business graduate from Ivey Business School," +
        " Western University.",
    link_type: "LinkedIn",
    link_url: "https://www.linkedin.com/in/tademidun/",
    link2_type: "Website",
    website_url: "https://tomiwa.ca/",
  },
  {
    first_name: "Aaron",
    last_name: "Doerfler",
    position: "Marketing",
    username: "aarondoerfler",
    img_url: aaronImage,
    description_1:
      "Aaron is a Media Information and Techno-culture (MIT) student at Western university.",
    link_type: "LinkedIn",
    link_url: "https://www.linkedin.com/in/aaron-doerfler-3a2144197/",
    link2_type: "Website",
    website_url: "https://aarondoerfler.github.io/",
  },
  {
    first_name: "Hadi",
    last_name: "Al Hakeem",
    position: "Software",
    username: "hadi",
    img_url: hadiImage,
    description_1:
        "Hadi is currently studying Mathematics at the University of Waterloo.",
    link_type: "LinkedIn",
    link_url: "https://www.linkedin.com/in/hadi-al-hakeem-24182819a/",
    link2_type: "Website",
    website_url: "https://hadihakeem.com/",
  },
  {
    first_name: "Yasith",
    last_name: "Ellewela",
    position: "Software",
    username: "Yasith",
    img_url: yasithImage,
    description_1: "Yasith is currently studying Mechatronics Engineering at the University of Waterloo.",
    link_type: "LinkedIn",
    link_url: "https://www.linkedin.com/in/yasith-ellewela-573b781b5/",
    link2_type: "Website",
    website_url: "https://yasithellewela.github.io/",
  },
];

function TeamMemberCard({ teamMember, showLinkedin = true }) {
  return (
    <div
      className='bg-white rounded shadow mb-3 p-3'
      style={{ height: "350px" }}
    >

      <img
        className='center-block-2'
        src={teamMember.img_url}
        alt={teamMember.first_name}
        style={{ width: "100px", height: "100px", borderRadius: "50%"}}

      />
      <h5 className='mb-0'>
        <strong>
          {teamMember.first_name} {teamMember.last_name}
        </strong>
      </h5>
      <span className='small text-uppercase text-muted'>
        {teamMember.position}
      </span>
      <ul className='social mb-0 list-inline mt-3'>
        {teamMember.username && (
          <React.Fragment>
            <li className='list-inline-item'>
              <Link to={`/profile/${teamMember.username}`}>Profile</Link>
            </li>
          </React.Fragment>
        )}

        {showLinkedin && teamMember.website_url && (
            <React.Fragment>
              |{" "}
              <li className='list-inline-item'>
                <a
                    href={teamMember.website_url}
                    className='social-link'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                  {teamMember.link2_type}
                </a>
              </li>

            </React.Fragment>
        )}

        {showLinkedin && teamMember.link_url && (
            <React.Fragment>
              |{" "}
              <li className='list-inline-item'>
                <a
                    href={teamMember.link_url}
                    className='social-link'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                  {teamMember.link_type}
                </a>
              </li>

            </React.Fragment>
        )}

      </ul>
      <p>{teamMember.description_1}</p>
    </div>
  );
}

TeamMemberCard.propTypes = {
  teamMember: PropTypes.shape({}),
};

const Team = ({ showArray = null, showLinkedin = true, showSeo = true }) => {
  const seoContent = {
    title: "Atila Team - The people that make Atila awesome",
    description: "Atila's team, the people that make Atila awesome.",
    image: "https://i.imgur.com/ekfz2sj.png",
    slug: "/team",
  };

  let teamCards = teamMembers.map((member) => (
    <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={member.first_name}>
      <TeamMemberCard teamMember={member} showLinkedin={showLinkedin} />
    </Col>
  ));

  //if showArray has names, it will cycle through and will only create cards for members whos
  // first names match the showNames array inputs
  if (!(showArray === null)) {
    teamCards = showArray.map((person) => {
      let index;
      for (index in teamMembers) {
        if (teamMembers[index].first_name === person) {
          return (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4.8}
              key={teamMembers[index].first_name}
            >
              <TeamMemberCard
                teamMember={teamMembers[index]}
                showLinkedin={showLinkedin}
              />
            </Col>
          );
        }
      }
      return null;
    });
  }

  return (
    <React.Fragment>
      {showSeo && <HelmetSeo content={seoContent} />}
      <div className='container mt-3'>
        <h1>The Atila Team</h1>
        <br />
        <Row gutter={16}>
          {teamCards}
          <br />
          <Col span={24} className='my-3' style={{ fontSize: "larger" }}>
            <br />
            If you would like to join the team or help out in some way,
            <a
              href='mailto:info@atila.ca'
              target='_blank'
              rel='noopener noreferrer'
            >
              {" "}
              send an email{" "}
            </a>{" "}
            to{" "}
            <a
              href='mailto:info@atila.ca'
              target='_blank'
              rel='noopener noreferrer'
            >
              info@atila.ca
            </a>{" "}
            with your resume and links to cool stuff you've done.
            <br/>
            <br/>
            Or message us on any of our social media platforms, found at the bottom of this page.
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Team;

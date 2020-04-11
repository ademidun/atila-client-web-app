import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import HelmetSeo from "../../../components/HelmetSeo";
import "../Ebook.scss";

const interviewees = [
  {
    first_name: "Alex",
    last_name: "Lamont",
    img_url: "https://i.imgur.com/dC642Sr.png",
    description_1:
      "Alex attended McGill’s Desautels Business School, and was a varsity soccer athlete",
    quote:
      "Just learn from your experiences and don’t be afraid to take risks.",
  },
  {
    first_name: "Anne",
    last_name: "Chung",
    img_url: "https://i.imgur.com/GDPc4eC.png",
    description_1:
      "Anne is a Computer Science student at The University of Waterloo",
    quote:
      "I think the opportunity to work with some really cool companies in undergrad is really unreal to me...that is why I went with Waterloo",
  },
  {
    first_name: "Raza ",
    last_name: "Khan",
    img_url: "https://i.imgur.com/aqYks77.png",
    description_1:
      "Raza studied at the Ivey School of Business at Western University and is the marketing manager of TELUS.",
    quote:
      "Everything will work out because you don't stop working until it does.",
  },
  {
    first_name: "Sarah ",
    last_name: "Chin",
    img_url: "https://i.imgur.com/ROVNTFa.png",
    description_1:
      "Sarah studied Chemistry at Queen’s University and is currently working for the Ontario Ministry of Children, Community, and Social Services",
    quote:
      "At the end of the day, you’re going to graduate university as a person ... so work on the best version of yourself.",
  },
  {
    first_name: "Emily ",
    last_name: "Chen",
    img_url: "https://i.imgur.com/P1utqdl.png",
    description_1: "Emily is at medical school student at the University of Toronto",
    quote:
        "At the end of the day, you’re going to graduate university as a person ... so work on the best version of yourself.",
  },
  {
    first_name: "Tomiwa ",
    last_name: "Ademidun",
    img_url: "https://i.imgur.com/Da74ZDi.png",
    description_1:
      "Tomiwa is is a dual degree in Engineering and Business student at the Ivey School of Business, Western University.",
    quote:
      "You’re paying all this money for tuition, textbooks, and all that stuff. But the most value you get" +
        " are the friends you make and the people you meet..." +
        " that stuff is free, which is kind of ironic.",
  },
];

function InterviewCard({ person }) {
  return (

    <div className='InterviewCard bg-white rounded shadow mb-3 p-3'>
      <h2 className="mb-2">
        {person.first_name} {person.last_name}
      </h2>
      <br />
      <img
        className='Image mb-3'
        src={person.img_url}
        alt={person.first_name}
      />

      <blockquote className="blockquote">
        <p className="mb-3">
          "{person.quote}"
        </p>
        <p className="blockquote-footer text-right">
          {person.description_1}
        </p>
      </blockquote>
    </div>
  );
}

InterviewCard.propTypes = {
  person: PropTypes.shape({}),
};

const EbookInterviews = () => {
  const seoContent = {
    title: "Atila Team - The people that make Atila awesome",
    description: "Atila's team, the people that make Atila awesome.",
    image: "https://i.imgur.com/ekfz2sj.png",
    slug: "/team",
  };

  let interviewCards = interviewees.map((interviewee) => (
    <Col xs={24} md={12} xl={8} key={interviewee.first_name}>
      <InterviewCard person={interviewee} />
    </Col>
  ));

  return (
    <React.Fragment>
      <HelmetSeo content={seoContent} />
      <div className='container mt-3'>
        <h1>The Students we Interviewed</h1>
        <br />
        <Row gutter={16}>{interviewCards}</Row>
      </div>
    </React.Fragment>
  );
};

export default EbookInterviews;

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
import HelmetSeo from "../../../components/HelmetSeo";
import tomiwaImg from "./assets/tomiwaImg.png";
import sarahImg from "./assets/sarahImg.png";
import razaImg from "./assets/razaImg.png";
import anneImg from "./assets/anneImg.png";
import emilyImg from "./assets/emilyImg.png";
import alexImg from "./assets/alexImg.png";
const interviewees = [
  {
    first_name: "Alex",
    last_name: "Lamont",
    img_url: alexImg,
    description_1:
      "Alex attended McGill’s Desautels Business School, and was a varsity soccer athlete",
    quote:
      "Just learn from your experiences and don’t be afraid to take risks.",
  },
  {
    first_name: "Anne",
    last_name: "Chung",
    img_url: anneImg,
    description_1:
      "Anne is a Computer Science student at The University of Waterloo",
    quote:
      "I think the opportunity to work with some really cool companies in undergrad is really unreal to me...that is why I went with Waterloo",
  },
  {
    first_name: "Emily ",
    last_name: "Chen",
    img_url: emilyImg,
    description_1: "Emily is at UofT medical school",
    quote:
      "At the end of the day, you’re going to graduate university as a person ... so work on the best version of yourself.",
  },
  {
    first_name: "Raza ",
    last_name: "Khan",
    img_url: razaImg,
    description_1:
      "Raza studied at the Ivey School of Business at Western University and is the marketing manager of TELUS.",
    quote:
      "Everything will work out because you don't stop working until it does.",
  },
  {
    first_name: "Sarah ",
    last_name: "Chin",
    img_url: sarahImg,
    description_1:
      "Sarah studied Chemistry at Queen’s University and is currently working for the Ontario Ministry of Children, Community, and Social Services",
    quote:
      "At the end of the day, you’re going to graduate university as a person ... so work on the best version of yourself.",
  },
  {
    first_name: "Tomiwa ",
    last_name: "Ademidun",
    img_url: tomiwaImg,
    description_1:
      "Tomiwa attended Western University where he completed a dual degree in Engineering and Business at the Ivey School of Business.",
    quote:
      "When you pick a school, you’re paying all this money for tuition, courses, textbooks, and all that kind of stuff. But the most value you get, and the most fun part, are the friends you make and the people you meet ... that stuff is free, which I’ve always found kind of ironic.",
  },
];

function InterviewCard({ person }) {
  return (
    /*<div className='item carousel-item'>
      <div className='img-box'></div>
      <p className='testimonial'>
        Vestibulum quis quam ut magna consequat faucibus. Pellentesque eget nisi
        a mi suscipit tincidunt. Utmtc tempus dictum risus. Pellentesque viverra
        sagittis quam at mattis. Suspendisse potenti. Aliquam sit amet gravida
        nibh, facilisis gravida odio. Phasellus auctor velit.
      </p>
      <p className='overview'>
        <b>Antonio Moreno</b>Web Developer at
      </p>
    </div>*/

    <div
      className='bg-white rounded shadow mb-3 p-3'
      style={{
        width: "550px",
        height: "350px",
        overflow: "scroll",
        textAlign: "center",
      }}
    >
      <strong style={{ fontSize: 24 }}>
        {person.first_name} {person.last_name}
      </strong>
      <br />
      <img
        className='mb-3'
        src={person.img_url}
        alt={person.first_name}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          left: "50%",
        }}
      />

      <p>{person.description_1}</p>

      <p>
        <b>Quote:</b> "{person.quote}"
      </p>
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
    <Col xs={24} sm={12} md={12} lg={12} xl={4.8} key={interviewee.first_name}>
      <InterviewCard person={interviewee} />
    </Col>
  ));

  return (
    <React.Fragment>
      <HelmetSeo content={seoContent} />
      <div className='container mt-3'>
        <h1>The people we interviewed</h1>
        <br />
        <Row gutter={16}>{interviewCards}</Row>
      </div>
    </React.Fragment>
  );
};

export default EbookInterviews;

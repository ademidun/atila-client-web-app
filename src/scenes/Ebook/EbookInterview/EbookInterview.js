import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "antd";
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
      "Raza studied at the Ivey School of Business at Western University and is a marketing manager at TELUS.",
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
      "Finding what motivates you and what excites you is important— and that might not be the first thing that you try.",
  },
  {
    first_name: "Emily ",
    last_name: "Chen",
    img_url: "https://i.imgur.com/P1utqdl.png",
    description_1:
      "Emily is at medical school student at the University of Toronto",
    quote:
      "At the end of the day, you’re going to graduate university as a person ... so work on the best version of yourself.",
  },
  {
    first_name: "Tomiwa ",
    last_name: "Ademidun",
    img_url: "https://i.imgur.com/Da74ZDi.png",
    description_1:
      "Tomiwa is a dual degree Engineering and Business student at the Ivey School of Business, Western University",
    quote:
      "You’re paying all this money for tuition, textbooks, and all that stuff. But the most value you get" +
      " are the friends you make and the people you meet..." +
      " that stuff is free, which is kind of ironic.",
  },
  {
    first_name: "Aaron",
    last_name: "Doerfler",
    img_url: "https://i.imgur.com/K4OQUN1.jpg",
    description_1:
      "Aaron is a Media Information and Techno-culture (MIT) student at Western university.",
    quote:
      "At Western I am surrounded by amazing students and faculty that provide me with an unmatched student experience",
  },
  {
    first_name: "Jacob",
    last_name: "Munene",
    img_url: "https://i.imgur.com/ZlJV8PU.jpg",
    description_1:
      "Jacob is currently studying Financial Modeling and Applied Mathematics at Western University.",
    quote:
      "If you dont know what you want to do, you can take a year off and figure out what your interests are",
  },
  {
    first_name: "Kitan",
    last_name: "Ademidun",
    img_url:
      "https://media-exp1.licdn.com/dms/image/C5603AQF3tTcZ9IalLg/profile-displayphoto-shrink_100_100/0?e=1592438400&v=beta&t=cfw3ODlSZvx9J2BXXY4Czxfi3JuFJK11YAGEFnm4Ex4",
    description_1:
      "Kitan is a dual degree Engineering and Business student at the Ivey School of Business, Western University.",
    quote:
      "You can literally end up anywhere, it’s just a matter of where you decide to go forward.",
  },
  {
    first_name: "Sameeksha",
    last_name: "Tirikollur",
    img_url:
      "https://media-exp1.licdn.com/dms/image/C5603AQEizoVMgL3g3w/profile-displayphoto-shrink_200_200/0?e=1592438400&v=beta&t=6w8TaOAYl_fRuhAp8-cCjk3IeTcUePJcpIO2QSbwviM",
    description_1:
      "Sameeksha is at Ivey Business school at the University of Western Ontario.",
    quote:
      "If you do choose to do post-secondary, dont forget about life outside the classroom",
  },
  {
    first_name: "Tashiya",
    last_name: "Halahackone",
    img_url:
      "https://media-exp1.licdn.com/dms/image/C4D03AQG1IK-liQgVHQ/profile-displayphoto-shrink_800_800/0?e=1592438400&v=beta&t=hidHVqmg-nBeN97B0ne_-NK7r3AdtBBqVOW58wH8Yfg",
    description_1:
      "Tashiya is studying International relations and affairs at the University of Western Ontario.",
    quote:
      "Dont be afraid to ask for help when you need it, because its there for you",
  },
  {
    first_name: "Tife",
    last_name: "Ademidun",
    img_url:
      "https://media-exp1.licdn.com/dms/image/C5603AQFi8Go1z-NimA/profile-displayphoto-shrink_200_200/0?e=1592438400&v=beta&t=UFJjfCuJZflXtZDluTeblTGuynSdLlnCnmMOWcpsqbs",
    description_1: "Tife is an engineering student at Western University",
    quote:
      "Dont compare yourself to others, just make sure your focused on you",
  },
];

function InterviewCard({ person }) {
  return (
    <div className='InterviewCard bg-white rounded shadow mb-3 p-3'>
      <h2 className='mb-2'>
        {person.first_name} {person.last_name}
      </h2>
      <br />
      <img
        className='Image mb-3'
        src={person.img_url}
        alt={person.first_name}
      />

      <blockquote className='blockquote'>
        <p className='mb-3'>"{person.quote}"</p>
        <p className='blockquote-footer text-right'>{person.description_1}</p>
      </blockquote>
    </div>
  );
}

InterviewCard.propTypes = {
  person: PropTypes.shape({}),
};

const EbookInterviews = () => {

  let interviewCards = interviewees.map((interviewee) => (
    <Col xs={24} md={12} xl={8} key={interviewee.first_name}>
      <InterviewCard person={interviewee} />
    </Col>
  ));

  return (
    <React.Fragment>
      <div className='container mt-3'>
        <h1>The Students we Interviewed</h1>
        <br />
        <Row gutter={16}>{interviewCards}</Row>
      </div>
    </React.Fragment>
  );
};

export default EbookInterviews;

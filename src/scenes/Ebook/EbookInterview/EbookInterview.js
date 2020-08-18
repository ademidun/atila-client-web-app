import React from "react";
import PropTypes from "prop-types";
import {Button, Col, Row} from "antd";
import "../Ebook.scss";
import {Link} from "react-router-dom";
import {scrollToElement} from "../../../services/utils";

const interviewees = [
  {
    first_name: "Alex",
    last_name: "Lamont",
    img_url: "https://i.imgur.com/dC642Sr.png",
    description_1:
      "Alex attended McGill’s Desautels Business School, and was a varsity soccer athlete",
    quote:
      "Sometimes you think if you do something it can be a waste of time,\n" +
        "but everything you do, you learn from it. Learn from your experiences and don’t be afraid to take risks.",
  },
  {
    first_name: "Anne",
    last_name: "Chung",
    img_url: "https://i.imgur.com/GDPc4eC.png",
    description_1:
      "Anne is a Computer Science student at The University of Waterloo",
    quote:
      "You never know where you\n" +
        "could meet your closest friends and this is the\n" +
        "time to build these relationships that will last a lifetime.",
  },
  {
    first_name: "Raza ",
    last_name: "Khan",
    img_url: "https://i.imgur.com/aqYks77.png",
    description_1:
      "Raza studied at the Ivey School of Business at Western University and is a marketing manager at TELUS.",
    quote:
      "When you go through things like your\n" +
        "first midterms and you fail a bunch, that’s fine.\n" +
        "You don’t have to accept it as a case fact. You\n" +
        "can just take it and then change it so you kind of\n" +
        "own your own destiny.",
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
      "Emily is a medical school student at the University of Toronto",
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
    first_name: "Tashiya",
    last_name: "Halahackone",
    img_url:
      "https://i.imgur.com/2ErrTkr.jpg",
    description_1:
      "Tashiya is studying International Relations and Affairs at Western University.",
    quote:
      "It’s completely fine to ask for resources because you’re paying for them, so you should use them whenever you.",
  },
  {
    first_name: "Aaron",
    last_name: "Doerfler",
    img_url:
      "https://i.imgur.com/3R3KCCn.jpg",
    description_1:
      "Aaron is a Media Information and Techno-culture (MIT) student at Western University.",
    quote:
      "If you think that you're making the best choice for you, and someone else is telling you it’s not, don’t second guess your own passion or your own truth, just go for it.",
  },
  {
    first_name: "Kitan",
    last_name: "Ademidun",
    img_url:
      "https://i.imgur.com/JHj0nPK.jpg",
    description_1:
      "Kitan is a dual degree Engineering and Business student at the Ivey School of Business, Western University.",
    quote:
      "University changed the way I look at gaining experience, in that I’m trying to gain more experience in things that build character.",
  },
  {
    first_name: "Jacob",
    last_name: "Munene",
    img_url:
      "https://i.imgur.com/LW0UsVb.jpg",
    description_1:
      "Jacob is currently studying Financial Modeling and Applied Mathematics at Western University.",
    quote:
      "I was telling my dad, that after school I want to take a year\n" +
        "off and focus on real estate, business, whatever it may be, and he wants me to jump straight\n" +
        "into work because he says 'you’ll be behind,' then I think, what am I being behind in?",
  },
  {
    first_name: "Sameeksha",
    last_name: "Tirikollur",
    img_url:
      "https://i.imgur.com/FmBWNIr.jpg",
    description_1:
      "Sameeksha is at Ivey Business school at Western University.",
    quote:
      "Don’t neglect the academics, but don’t forget there’s a whole lot more to be learned outside of it by doing things that aren’t conventionally good for your resume or builds your skills.",
  },
  {
    first_name: "Tife",
    last_name: "Ademidun",
    img_url:
      "https://i.imgur.com/986xHbQ.jpg",
    description_1: "Tife is an Engineering student at Western University",
    quote:
      "Don't just keep looking at other people and what they're doing... make sure you're personally focused on trying to get better instead of seeing how you measure up against other people.",
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
  let interviewCards = interviewees.map((interviewee, index) => (
    <React.Fragment key={interviewee.first_name}>
      {["0", "6"].includes(index.toString()) && (
        <Col span={24} className='text-center'>
          <img
              className="responsive-images"
              src={index === 6 ?'https://i.imgur.com/XluzC2w.jpg' : 'https://i.imgur.com/8GP6ohn.jpg'}
              alt='Western Students' />
        </Col>
      )}
      <Col xs={24} md={12} xl={8}>
        <InterviewCard person={interviewee} />
      </Col>
    </React.Fragment>
  ));

  return (
    <React.Fragment>
      <div className='container mt-3'>
        <h1>The Students we Interviewed</h1>
        <br />
        <Row gutter={16}>{interviewCards}</Row>
      </div>
      <Link to='/team'
            className="text-center center-block"
            style={{fontSize: 40}} >
         See The Atila Team that made this book
      </Link>

      <Button
          type="primary"
          className="text-center center-block"
          onClick={event=>{ event.preventDefault(); scrollToElement("#EbookLandingBanner")}}>
        Scroll To Top
      </Button>
    </React.Fragment>
  );
};

export default EbookInterviews;

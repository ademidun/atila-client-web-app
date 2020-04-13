import React from "react";
import { Col, Row } from "antd";
import "./Ebook.scss";

const chapters1 = [
  {
    number: 1,
    name: "Introduction",
    subchapters: [
      {
        name: "Am I a hypocrite?",
        number: 1,
      },
      {
        name: "What Should You optimize for?",
        number: 2,
      },
      {
        name: "How to read this guide",
        number: 3,
      },
      {
        name: "Methodology",
        number: 4,
      },
    ],
  },
  {
    number: 2,
    name: "Tech",
    subchapters: [
      {
        name: "The Top 5 Schools for Tech:",
        number: 1,
      },
      {
        name: "The Best Paying Firms for an Entry-Level Software Engineer",
        number: 2,
      },
      {
        name: "The Best Paying Firms for an Entry-Level Product Manager",
        number: 3,
      },
      {
        name:
          "Waterloo is extremely good at placing students at tech companies and it’s not even close",
        number: 4,
      },
      {
        name: "Top 5 Schools are Actually 5 Tiers (with big Gaps)",
        number: 5,
      },
    ],
  },
];

const chapters2 = [
  {
    number: 3,
    name: "Investment Banking",
    subchapters: [
      {
        name: "The Top 5 Schools for Investment Banking:",
        number: 1,
      },
      {
        name: "The Top 5 Schools for Goldman Sachs:",
        number: 2,
      },
      {
        name: "The Best Paying Firms for an Entry-Level Analyst",
        number: 3,
      },
      {
        name:
          "The Best Schools for American and Canadian Investment Banks Are Suprisingly Very Different",
        number: 4,
      },
      {
        name:
          "Ivey, Queen’s and McGill vs Toronto and Waterloo: Old School vs New School",
        number: 5,
      },
    ],
  },
  {
    number: 4,
    name: "Consulting",
    subchapters: [
      {
        name: "The top 5 Schools for MBB Consulting:",
        number: 1,
      },
      {
        name: "The Best Paying Firms for an Entry-Level Analyst Position:",
        number: 2,
      },
      {
        name:
          "Mckinsey, Bain, BCG Recruiting is very different from Deloitte and Accenture Recruiting",
        number: 3,
      },
      {
        name:
          "Canadian Schools don’t perform well in landing students in upper management",
        number: 4,
      },
    ],
  },
];

function ChaptersCard({ chapter }) {
  return (
    <React.Fragment>
      <Col className='chapter-item'>
        <div>
          <h2>Chapter {chapter.number}</h2>
          <div className='chapter-name'>
            <h4>{chapter.name}</h4>
            <hr />
          </div>
          {chapter.subchapters &&
            chapter.subchapters.map((subchapter) => (
              <div className='subchapter-item'>
                <p>
                  <li>{subchapter.name}</li>
                </p>
                <p>
                  {chapter.number}.{subchapter.number}
                </p>
              </div>
            ))}
        </div>
      </Col>
    </React.Fragment>
  );
}

const EbookChapter = () => {
  return (
    <React.Fragment>
      <h1>
        Peek Inside
        <span role='img' aria-labelledby='eyes'>
          👀
        </span>
      </h1>
      <h4 style={{ textAlign: "center" }}>
        Here are some of the contents of the guide
      </h4>
      <div>
        <br />
        <Row className='ebook-row'>
          <Col xs={24} md={12} lg={12} xl={12} className='text-center'>
            {chapters1.map((chapter) => (
              <React.Fragment>
                <ChaptersCard chapter={chapter} />
              </React.Fragment>
            ))}
          </Col>
          <Col xs={24} md={12} lg={12} xl={12} className='text-center'>
            {chapters2.map((chapter) => (
              <React.Fragment>
                <ChaptersCard chapter={chapter} />
              </React.Fragment>
            ))}
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default EbookChapter;

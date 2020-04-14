import React from "react";
import { Col, Row } from "antd";
import "./Ebook.scss";

const chapters1 = [
  {
    number: 2,
    name: "Tech",
    subchapters: [
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

  {
    number: 3,
    name: "Investment Banking",
    subchapters: [
      {
        name: "The Top 5 Schools for Investment Banking:",
        number: 1,
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
];

const chapters2 = [
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

  {
    number: 5,
    name: "All Industires",
    subchapters: [
      {
        name: "Are the most well-known Canadian universities even that good?",
        number: 1,
      },
      {
        name: "Canadian schools have their students employed mostly in tech",
        number: 2,
      },
      {
        name: "Which industry pays the best?",
        number: 3,
      },
    ],
  },
];

function ChaptersCard({ chapter }) {
  return (
    <React.Fragment>
      <Col className='chapter-item card shadow p-3'>
        <div>
          <h2>{chapter.name} Chapter</h2>
          <div className='chapter-name'>
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
      <br />
    </React.Fragment>
  );
}

const EbookChapter = () => {
  return (
    <React.Fragment>
      <h1>
        Peek Inside
      </h1>
      <h4 style={{ textAlign: "center" }}>
        Here are some of the contents of the guide
      </h4>
      <div>
        <br />

        <Row className='ebook-row'>
          {/* left column of chapters */}
          <Col
            xs={24}
            md={12}
            lg={12}
            xl={12}
            className='text-center chapter-col'
          >
            {chapters1.map((chapter) => (
              <React.Fragment>
                <ChaptersCard chapter={chapter} />
              </React.Fragment>
            ))}
          </Col>
          {/* right column of chapters */}
          <Col
            xs={24}
            md={12}
            lg={12}
            xl={12}
            className='text-center chapter-col'
          >
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

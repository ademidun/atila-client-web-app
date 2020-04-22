import React from "react";
import { Col, Row } from "antd";
import "./Ebook.scss";

const EbookDescription = (props) => {
  return (
    <div className=' EbookLandingBanner'>
      <div>
        <br />
        <Row className='ebook-row'>
          <Col xs={24} md={10} lg={8} className='text-center buy-now-cta'>
            <div>
              <h2>Whats inside?</h2>
              <h5>
                We have over 100 pages of interviews, rankings, and much more
                about what Canadian universities are the best for jobs
              </h5>
              <br />
              <ul>
                <li>
                  {" "}
                  <h6 className='text-left'>
                    Insights on Investment Banking, Tech, and more!
                  </h6>
                </li>
                <li>
                  {" "}
                  <h6 className='text-left'>How to pick a school</h6>
                </li>
                <li>
                  <h6 className='text-left'>
                    Real data on salaries, placements at companies, and industry
                    hiring trends
                  </h6>
                </li>
              </ul>
            </div>
          </Col>
          <Col
            xs={24}
            md={14}
            lg={16}
            className='card'
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <div className='ebook-image text-center'>
              <img src='https://i.imgur.com/7HtJNot.png' alt='Book cover' />
            </div>

            <br />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EbookDescription;

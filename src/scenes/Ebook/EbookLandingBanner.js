import React, { Component } from "react";
import {Button, Col, Row} from "antd";
import "./Ebook.scss";
import {handleButtonClickEventFacebook} from "../../models/Utils";
import {EBOOK_AUDIENCE_IMAGES} from "../../models/Constants";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class EbookLandingBanner extends Component {

  render() {

    const { audience, showLearnMoreCTA, heightClassName } = this.props;


    const title = "Atila Schools and Jobs Guide";

    return (
      <div className={`EbookLandingBanner mx-sm-3 ${heightClassName}`} id="EbookLandingBanner">
        <div>
          <br />
          <h1 className='col-sm-12 text-center my-md-5'>
              {showLearnMoreCTA &&
              <Link to="/schools">
                  {title}
              </Link>
              }
              {!showLearnMoreCTA &&
                <React.Fragment>
                    {title}
                </React.Fragment>
              }
          </h1>

          <Row className='ebook-row'>
            <Col xs={24} md={10} lg={8} className='text-center buy-now-cta'>
              <div>
                <h2>
                    A guide to the best Canadian universities
                    for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.
                </h2>
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
                <img src={EBOOK_AUDIENCE_IMAGES[audience || '1'].ebookLandingImage}
                     alt='Book cover' />
              </div>
              <Button className='buy-book-button center-block' type='primary'>
                <a
                  href='https://gum.co/BbFon'
                  target='_blank'
                  rel='noopener noreferrer'
                  name="AddToCart"
                  onClick={handleButtonClickEventFacebook}
                >
                  Buy this Book
                </a>
              </Button>
              {showLearnMoreCTA && 
              
              <Button className='center-block mt-2' style={{fontSize: "30px"}}>
                <Link to="schools">
                  Learn More
                </Link>
              </Button>
              }
              <br />
            </Col>
          </Row>
        </div>

        <link rel="preload" href="https://gum.co/BbFon" as="document" />
        <link rel="preload" href="https://gumroad.com/l/BbFon" as="document" />
      </div>
    );
  }
}

EbookLandingBanner.defaultProps = {
    audience: '1',
    heightClassName: "vh-100-min",
    showLearnMoreCTA: false
};

EbookLandingBanner.propTypes = {
    audience: PropTypes.string,
    showLearnMoreCTA: PropTypes.bool,
};
export default EbookLandingBanner;

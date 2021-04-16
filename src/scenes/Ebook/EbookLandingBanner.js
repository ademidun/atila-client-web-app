import React, { Component } from "react";
import {Button, Col, Row, Tag} from "antd";
import "./Ebook.scss";
import {handleButtonClickEventFacebook} from "../../models/Utils";
import EbookChapter from "./EbookChapter";
import {EBOOK_AUDIENCE_IMAGES} from "../../models/Constants";
import PropTypes from "prop-types";
import ScholarshipsListFilter from "../Scholarship/ScholarshipsListFilter";
import {Link} from "react-router-dom";

class EbookLandingBanner extends Component {
  state = {
    showBookChapters: true,
  };

  render() {
    const { showBookChapters } = this.state;

    const { audience, showTitleCTA } = this.props;

    const showBookChaptersButton = (
        <Button
            className='center-block'
            type='info'
            name="PreviewBook"
            style={{ fontSize: "larger" }}
            onClick={(event) => {
                const { showBookChapters } = this.state;
                this.setState({ showBookChapters: !showBookChapters });
                handleButtonClickEventFacebook(event);
            }}
        >
            {showBookChapters ? 'Hide' : 'Show'} Book Chapters
        </Button>
    );

    const title = "Atila Schools and Jobs Guide";

    return (
      <div className="EbookLandingBanner mx-sm-3" id="EbookLandingBanner">
        <div className="vh-100-min">
          <br />
          <h1 className='col-sm-12 text-center my-md-5'>
              {showTitleCTA &&
              <Link to="/schools">
                  {title}
                  <br/>
                  <Tag color="green">New</Tag>
              </Link>
              }
              {!showTitleCTA &&
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
              <br />
                {showBookChaptersButton}
            </Col>
          </Row>
        </div>

          {showBookChapters &&
            <React.Fragment>
                <hr/>
                <EbookChapter />
                {showBookChaptersButton}
            </React.Fragment>

          }

        <link rel="preload" href="https://gum.co/BbFon" as="document" />
        <link rel="preload" href="https://gumroad.com/l/BbFon" as="document" />
      </div>
    );
  }
}

ScholarshipsListFilter.defaultProps = {
    audience: '1',
    showTitleCTA: false
};

EbookLandingBanner.propTypes = {
    audience: PropTypes.string,
    showTitleCTA: PropTypes.bool,
};
export default EbookLandingBanner;

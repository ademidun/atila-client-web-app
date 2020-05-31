import React, { Component } from "react";
import { Button, Col, Row } from "antd";
import "./Ebook.scss";
import {handleButtonClickEventFacebook} from "../../models/Utils";
import EbookChapter from "./EbookChapter";
import {EBOOK_AUDIENCE_IMAGES} from "../../models/Constants";
import PropTypes from "prop-types";
import ScholarshipsListFilter from "../Scholarship/ScholarshipsListFilter";

class EbookLandingBanner extends Component {
  state = {
    showPreview: false,
  };

  render() {
    const { showPreview } = this.state;

    const { audience } = this.props;

    console.log('this.props', this.props);

    const bookPreviewButton = (
        <Button
            className='center-block'
            type='primary'
            name="PreviewBook"
            style={{ fontSize: "larger" }}
            onClick={(event) => {
                const { showPreview } = this.state;
                this.setState({ showPreview: !showPreview });
                handleButtonClickEventFacebook(event);
            }}
        >
            {showPreview ? 'Hide' : ''} Show Inside the Book
        </Button>
    );

    return (
      <div className='vh-100-min EbookLandingBanner mx-sm-3'>
        <div>
          <br />
          <h1 className='col-sm-12 text-center my-md-5'>
            Atila Schools and Jobs Guide
          </h1>

          <Row className='ebook-row'>
            <Col xs={24} md={10} lg={8} className='text-center buy-now-cta'>
              <div>
                <h2>
                  A guide to the best Canadian Universities for getting jobs at
                  Goldman Sachs, Google, McKinsey, Pfizer and more.
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
                  Buy this Book - $33
                </a>
              </Button>
              <br />
                {bookPreviewButton}
            </Col>
          </Row>
        </div>

          {showPreview &&
            <React.Fragment>
                <hr/>
                <EbookChapter />
                {bookPreviewButton}
            </React.Fragment>

          }

        <link rel="preload" href="https://example.com/widget.html" as="document" />
      </div>
    );
  }
}

ScholarshipsListFilter.defaultProps = {
    audience: '1',
};

EbookLandingBanner.propTypes = {
    audience: PropTypes.string,
};
export default EbookLandingBanner;

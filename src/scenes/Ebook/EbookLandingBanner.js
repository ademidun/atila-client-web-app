import React, { Component } from "react";
import {Button, Col, Modal, Row} from "antd";
import "./EbookLandingBanner.scss";

class EbookLandingBanner extends Component {

  state = {
    showPreview: false,
  };

  closePreview = (event) => {
    event.stopPropagation();
    this.setState({ showPreview: false });
  } ;

  render() {
    return (
      <div className='vh-100 EbookLandingBanner'>
        <div>
          <br />
          <h1 className='col-sm-12 text-center my-md-5'>
            Atila Schools and Jobs Guide 🔥
          </h1>

          <Row className='ebook-row'>
            <Col xs={24} md={10} lg={8} className='text-center buy-now-cta'>
              <div>
                <h2>
                  A guide to
                  the best Canadian Universities for getting jobs at Goldman
                  Sachs, Google, McKinsey, Pfizer and more.
                </h2>
              </div>
            </Col>
            <Col xs={24} md={14} lg={16}
              className='card'
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <div className="ebook-image text-center">
                <img
                  src='https://i.imgur.com/PMg68If.png'
                  alt='Book cover'
                />
              </div>
              <Button className='buy-book-button center-block'
                      type='primary'>
                <a href="https://gum.co/BbFon" target="_blank" rel="noopener noreferrer" >
                  Buy this Book
                </a>
              </Button>
              <br/>

              <Button
                className="center-block"
                type='primary'
                style={{ fontSize: "larger" }}
                onClick={() => {
                  this.setState({ showPreview: true });
                }}
              >
                See Preview of Book
              </Button>
            </Col>
          </Row>
        </div>

        <Modal
            visible={this.state.showPreview}
            width='75%'
            closable={false}
            maskStyle={{ background: "rgba(0,0,0,0.93)", width: "100%" }}
            footer={[
              <Button
                  onClick={this.closePreview}
                  type='primary'
              >
                Close
              </Button>,
            ]}
            onCancel={this.closePreview}
        >
          <iframe
              src='https://atila-schools-and-jobs-guide.s3.amazonaws.com/atila-ebook-online-preview.pdf'
              title='Atila Schools and Jobs Ebook Preview'
              style={{ width: "100%", height: "75vh" }}
          />
        </Modal>

      </div>
    );
  }
}
export default EbookLandingBanner;

import React, { Component } from "react";
import {Button, Col, Modal, Row} from "antd";
import "./EbookLandingBanner.scss";

class EbookLandingBanner extends Component {
  state = {
    showPreview: false,
  };

  render() {
    return (
      <div className='vh-100 EbookLandingBanner'>
        <div>
          <br />
          <h1 className='col-sm-12 text-center my-md-5'>
            Atila Schools and Jobs Guide
          </h1>

          <Row className='ebook-row'>
            <Col xs={24} md={8} lg={6} className='text-center buy-now-cta'>
              <div>
                <h2>
                  The best Canadian Universities for getting jobs at Goldman
                  Sachs, Google, McKinsey, Pfizer and more.
                </h2>
              </div>
              <div className='col text-center'>
                <button className='btn btn-primary'>Buy Now for $29.99</button>
              </div>
            </Col>
            <Col xs={24} md={16} lg={18}
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

              <Button
                className='my-3'
                type='primary'
                style={{ width: "50%", left: "25%" }}
                onClick={() => {
                  this.setState({ showPreview: true });
                }}
              >
                Click for preview
              </Button>

              {this.state.showPreview && (
                <div className='col text-center'>
                  <Button>
                    <h1 className="text-white">Buy Now for $29.99</h1>
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </div>

        {this.state.showPreview && (
          <Modal
            visible={this.state.showPreview}
            maskClosable={true}
            width='75%'
            maskStyle={{ background: "rgba(0,0,0,0.93)", width: "100%" }}
            closable={true}
            footer={[
              <Button
                onClick={(e) => {
                  this.setState({ showPreview: false });
                  console.log(this.state.showPreview);
                }}
                type='primary'
              >
                Close
              </Button>,
            ]}
          >
            <iframe
              src='https://storage.googleapis.com/atila-7.appspot.com/public/atila-ebook-preview-sample.pdf'
              title='Atila Schools and Jobs Ebook Preview'
              style={{ width: "100%", height: "75vh" }}
            />
          </Modal>
        )}
      </div>
    );
  }
}
export default EbookLandingBanner;

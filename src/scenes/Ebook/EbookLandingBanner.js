import React, { Component } from "react";
import { Button, Modal } from "antd";
import './EbookLandingBanner.scss';

class EbookLandingBanner extends Component {
  state = {
    showPreview: false,
  };

  render() {
    return (
      <div className="vh-100 EbookLandingBanner">
        <div>
          <br />
          <h1 className='col-sm-12 text-center my-5'>
            Atila Schools and Jobs Report
          </h1>

          <div className='row'>
            <br />
            <div className='col text-center'>
              <br />
              <div className="px-5">
                <h2>
                  The best Canadian Universities for getting jobs at Goldman
                  Sachs, Google, McKinsey, Pfizer and more.
                </h2>
              </div>
              <div className='col text-center'>
                <p>Coming Soon</p>
              </div>
              <div className='col text-center'>
                <button className='btn btn-primary'>Buy Now for $29.99</button>
              </div>
            </div>
            <div
              className='card col'
              style={{
                backgroundColor: "transparent",
                border: "0px",
                borderColor: "transparent",
              }}
            >
              <div>
                <img
                  src='https://i.imgur.com/AM0KTy9.png'
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
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
                    <h1 style={{ color: "white" }}>Buy Now for $29.99</h1>
                  </Button>
                </div>
              )}
            </div>
          </div>
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

import React, { Component } from "react";
import {Button} from "antd";

class EbookLandingBanner extends Component {
  state = {
    showPreview: false,
  };

  render() {
    return (
      <div
        className='container'
        style={
          this.state.showPreview
            ? { backgroundColor: "rgba(0, 0, 0, 0.5)" }
            : null
        }
      >
        <h1 className='col-sm-12 text-center'>Atila Schools and Jobs Report</h1>

        <div className='row'>
          <br />
          <div className='col text-center'>
            <br />
            <div>
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
          {this.state.showPreview && (
            <div>
              <button
                onClick={(e) => {
                  this.setState({ showPreview: false });
                  console.log(this.state.showPreview);
                }}
              >
                Close
              </button>
              <br />
              <iframe
                src='https://storage.googleapis.com/atila-7.appspot.com/public/atila-ebook-preview-sample.pdf'
                title='Atila Schools and Jobs Ebook Preview'
                style={{width: '90%', height: '90%'}}
              />
            </div>
          )}
          <div
            className='card shadow col'
            style={
              this.state.showPreview
                ? { backgroundColor: "rgba(0, 0, 0, 0.5)" }
                : null
            }
          >
            <div>
              <img
                src='https://i.imgur.com/AM0KTy9.png'
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                alt='Book cover'
              />
            </div>
            {!this.state.showPreview && (
              <button
                className='btn btn-primary'
                onClick={(e) => {
                  this.setState({ showPreview: true });
                  console.log(this.state.showPreview);
                }}
              >
                Click for preview
              </button>
            )}

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
    );
  }
}
export default EbookLandingBanner;

/*

*/

import React, { Component } from "react";
import { render } from "enzyme";

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
                width={450}
                height={650}
                src='https://storage.googleapis.com/atila-7.appspot.com/public/Atila-Schools-and-Jobs-Report-Body-Draft-2.pdf'
                title='Preview'
              ></iframe>
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
                src='https://scontent.fyto1-1.fna.fbcdn.net/v/t1.15752-9/s2048x2048/92129151_668969287268274_8505358619993178112_n.png?_nc_cat=103&_nc_sid=b96e70&_nc_ohc=Fu52aSll0TcAX-EwpcO&_nc_ht=scontent.fyto1-1.fna&oh=f60201f4bbd865746bf791bb7b2bc1cb&oe=5EAE716A'
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
                <a>
                  <h1 style={{ color: "white" }}>Buy Now for $29.99</h1>
                </a>
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

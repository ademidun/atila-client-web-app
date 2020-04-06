import React, { Component } from "react";
import { render } from "enzyme";

class EbookLandingBanner extends Component {
  state = {
    showPreview: false,
  };

  render() {
    return (
      <div>
        <div
          className='container'
          style={
            this.state.showPreview
              ? { backgroundColor: "rgba(0, 0, 0, 0.5)" }
              : null
          }
        >
          <h1 className='col-sm-12 text-center'>
            Atila Schools and Jobs Report
          </h1>

          <div className='row'>
            <br />
            <div className='col text-center'>
              <br />
              <div>
                <h2>
                  <br />
                  <br />
                  The best Canadian Universities for getting jobs at Goldman
                  Sachs, Google, McKinsey, Pfizer and more.
                </h2>
              </div>
              <div className='col text-center'>
                <p>Coming Soon</p>
              </div>
              <div className='col text-center'>
                <button className='btn btn-primary'>Buy Now for $29.99</button>{" "}
                {!this.state.showPreview && (
                  <button
                    className='btn btn-info'
                    onClick={(e) => {
                      this.setState({ showPreview: true });
                      console.log(this.state.showPreview);
                    }}
                  >
                    Click for preview
                  </button>
                )}
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
              className='card col'
              style={
                this.state.showPreview
                  ? { backgroundColor: "rgba(0, 0, 0, 0.5)" }
                  : { border: "0px" }
              }
            >
              <div>
                <img
                  src='https://scontent.fyto1-1.fna.fbcdn.net/v/t1.15752-9/s2048x2048/92129151_668969287268274_8505358619993178112_n.png?_nc_cat=103&_nc_sid=b96e70&_nc_ohc=Fu52aSll0TcAX-EwpcO&_nc_ht=scontent.fyto1-1.fna&oh=f60201f4bbd865746bf791bb7b2bc1cb&oe=5EAE716A'
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                  alt='Book cover'
                />
              </div>

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

        <br />
        <div className='container'>
          <div className='row'>
            <div className='  col'>
              <div>
                <img
                  src='https://lh3.googleusercontent.com/K4PHJBGmzCyidnX26KfnK6Y4hvGYgs39q7u_-hFJvj0NPAtGnEvzuiRMW2CNB9wxe6uCk8i2xqcrra0N3ESejTbbAN2RoQYDxjtaQGvTFmTC5Mt6yTHcnGDecBoQfMlSwgkS4Lrr0v4ufCKHS0VopuubJN3fOin0YsPRecdeXd98mjmb4t_srwaE8XdOoDbfoJ0h_10W5CgATeinYa8XO4v8ahJxqqNBS9xYY2wSiSjUIu_xpzI4UfCSyS7RXagWPvyMw2dCvURNA1-JtFlgIq6W0fEJwmUuRI__5oX4hQD-XFZ55Erb7On_jqgGSboFahRBTSi2qVPLN9UpWd9OVP_Sk5Ws4WAJs4k6XOFSOkGN3XCa9wlzDMhVHhNz37qI1Zqp-aUzlRBYZAIP3MdcRcAvpYouLmF_GFwjBPGHeQZxct2W6YoRWLYLwhlgnuS3oUNsoY0Ie87-A_LdhQCsfkXhJizfFDqFJuyMUVivOpiRdrF26kE9Y1bDDSK5MC14qmSD1CH9WYBTMqHxeTriMrOeI0qf_HMQQdP_NBeBA18Re1JOYSFROjfGZBMEEYyNTMmofR42SRQNlqPMMeXHiWTTb_MNjI4Xyn0rj1VZ6fcLXUr_FhQg3qeQEKLE6EUlE0eU8ivMlaOiboaKx5g9h7n6Ia7N6ecJb2JRXuDK1Bq8AlA-aQNezZ0WQvIC-Pmc_xClQB9xLw13s9DvanpJZNfFeMiT1qDwfXynzfmXFrfyF1zAEyfcrsYQ=w1500-h1383-no'
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                  alt='Book cover'
                />
              </div>
            </div>
            <br />
            <div className='col text-center'>
              <br />
              <div>
                <br />
                <br />
                <br />
                <h2>Sign up for a preview</h2>
              </div>
              <div className='col text-center'>
                <form className='row p-3'>
                  <input
                    placeholder='Full Name'
                    className='col-12 mb-3 form-control'
                  />
                  <input
                    placeholder='Email'
                    className='col-12 mb-3 form-control'
                  />
                </form>
              </div>
              <div className='col text-center'>
                <button className='btn btn-primary'>Get Preview</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EbookLandingBanner;

/*

*/

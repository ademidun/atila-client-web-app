import React, { Component } from "react";
import { Row } from "antd";
import "../Ebook/Ebook.scss";
import {Link, withRouter} from "react-router-dom";
import EbookPremiumTabs from "./EbookPremiumTabs";
import UtilsAPI from "../../services/UtilsAPI";
import ResponseDisplay from "../../components/ResponseDisplay";

class EbookPremiumBanner extends Component {


  constructor(props) {
    super(props);


    const {
      location : { search },
    } = this.props;


    const params = new URLSearchParams(search);
    const email = params.get('email') || '';
    const licenseKey = params.get('licenseKey') || '';

    this.state = {
      email,
      token: licenseKey,
      isLoadingResponse: false,
      responseError: false,
      loggedIn: false,
    };
  }



  componentDidMount() {
    if(localStorage.getItem('ebookUserEmail')) {
      this.setState({ loggedIn: true });
    }
  }

  updateForm = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  submitForm = (event) => {
    event.preventDefault();
    const { email, token } = this.state;
    this.setState({ isLoadingResponse: true, responseError: false });

    UtilsAPI.authenticateEbookUser(email, token)
        .then( res => {
          console.log({res});
          localStorage.setItem("ebookUserEmail", email);
          this.setState({ loggedIn: true, isLoadingResponse: false });
        })
        .catch( err => {
          console.log({err});
          this.setState({responseError: err.response? err.response.data : err, isLoadingResponse: false});
        });
  };

  render() {
    const { email, token, isLoadingResponse, loggedIn, responseError } = this.state;
    return (
      <React.Fragment>
        {!loggedIn && (
          <div className='vh-100 EbookPremiumBanner'>
            <div>
              <Row className='text-center'>
                <div className='container mt-5'>
                  <div className='card shadow p-3'>
                    <div>
                      <h1>Login</h1>
                      <form className='row p-3' onSubmit={this.submitForm}>
                        <input
                          placeholder='Email you purchased the book with'
                          className='col-12 mb-3 form-control'
                          name='email'
                          value={email}
                          onChange={this.updateForm}
                        />

                      <input
                        placeholder='License Key you received after purchasing book (check your email)'
                        className='col-12 mb-3 form-control'
                        name='token'
                        value={token}
                        onChange={this.updateForm}
                      />
                        <ResponseDisplay isLoadingResponse={isLoadingResponse}
                                         responseError={responseError} />
                      <div className='w-100'>
                        <button
                          className='btn btn-primary col-sm-12 col-md-5 float-left mb-1'
                          type='submit'
                          disabled={isLoadingResponse}
                        >
                          Login
                        </button>
                        <Link
                          to='/schools'
                          className='btn btn-outline-primary col-sm-12 col-md-5 float-right'
                        >
                          Buy Ebook
                        </Link>
                      </div>
                      {/*<button*/}
                      {/*  className='btn btn-link max-width-fit-content'*/}
                      {/*  onClick={(event) => {*/}
                      {/*    event.preventDefault();*/}
                      {/*    this.setState({ forgotPassword: true });*/}
                      {/*  }}*/}
                      {/*>*/}
                      {/*  Forgot password?*/}
                      {/*</button>*/}
                    </form>
                  </div>
                </div>
              </div>
            </Row>
          )}
        </div>
      </div>
        )}
      {loggedIn && <EbookPremiumTabs />}
      </React.Fragment>)
  }
}
export default  withRouter(EbookPremiumBanner);

import React, { Component } from "react";
import { Row } from "antd";
import "../Ebook/Ebook.scss";
import { Link } from "react-router-dom";
import TableauGraphsEmbedded from "../Ebook/TableauGraphsEmbed";

class EbookPremiumBanner extends Component {
  state = {
    email: "",
    token: "",
    isLoadingResponse: false,
    loggedIn: false,
  };
  updateForm = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  submitForm = (event) => {
    event.preventDefault();
    const { email, token } = this.state;
    this.setState({ isLoadingResponse: true, loggedIn: true });
  };

  render() {
    const { email, token, isLoadingResponse, loggedIn } = this.state;
    return (
      <div className='vh-100 EbookPremiumBanner'>
        <div>
          <br />
          <h1 className='col-sm-12 text-center my-md-5'>
            Atila Schools and Jobs Guide Premium Section
          </h1>

          {!loggedIn && (
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
                        placeholder='Token'
                        className='col-12 mb-3 form-control'
                        name='token'
                        value={token}
                        onChange={this.updateForm}
                      />
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
                      <button
                        className='btn btn-link max-width-fit-content'
                        onClick={(event) => {
                          event.preventDefault();
                          this.setState({ forgotPassword: true });
                        }}
                      >
                        Forgot password?
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </Row>
          )}

          {loggedIn && <TableauGraphsEmbedded />}
        </div>
      </div>
    );
  }
}
export default EbookPremiumBanner;

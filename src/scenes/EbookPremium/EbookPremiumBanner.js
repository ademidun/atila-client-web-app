import React, { Component } from "react";
import {Button, Row} from "antd";
import "../Ebook/Ebook.scss";
import {Link, withRouter} from "react-router-dom";
import EbookPremiumTabs from "./EbookPremiumTabs";
import UtilsAPI from "../../services/UtilsAPI";
import ResponseDisplay from "../../components/ResponseDisplay";
import {connect} from "react-redux";
import {updateEbookUserProfile} from "../../redux/actions/user";
import PropTypes from "prop-types";


export const FREE_PREVIEW_EMAIL = 'preview@atila.ca';
export const FREE_PREVIEW_LICENSE_KEY = 'freepreview7';

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
      licenseKey,
      isLoadingResponse: false,
      responseError: false,
    };
  }

  componentDidMount() {
    const { updateEbookUserProfile } = this.props;
    const email = localStorage.getItem('ebookUserEmail');
    if(email) {
      updateEbookUserProfile({email});
    }
  }

  updateForm = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  submitForm = (event) => {
    event.preventDefault();
    const { email, licenseKey } = this.state;
    const { updateEbookUserProfile } = this.props;

    if (!email || !licenseKey) {
      this.setState({responseError: `${!email ? 'Email' : 'License Key'} cannot be blank`});
        return
    }

    this.setState({ isLoadingResponse: true, responseError: false });

    UtilsAPI.authenticateEbookUser(email, licenseKey)
        .then( res => {
          console.log({res});
          localStorage.setItem("ebookUserEmail", email);
          this.setState({ isLoadingResponse: false });
          updateEbookUserProfile({email, licenseKey});
        })
        .catch( err => {
          console.log({err});
          this.setState({responseError: err.response? err.response.data : err, isLoadingResponse: false});
        });
  };

  autoFillPreview = (event) => {
    event.preventDefault();

    this.setState({
      email: FREE_PREVIEW_EMAIL,
      licenseKey: FREE_PREVIEW_LICENSE_KEY
    })
  };

  render() {
    const { email, licenseKey, isLoadingResponse, responseError } = this.state;
    const { ebookUserProfile } = this.props;

    const loggedIn = ebookUserProfile && ebookUserProfile.email;

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
                        <small>
                          Hint: For a free preview use,
                          email: <code>{FREE_PREVIEW_EMAIL}</code>{' '}
                          License key: <code>{FREE_PREVIEW_LICENSE_KEY}</code>{' '}
                          <Button onClick={this.autoFillPreview}
                                  type="link">
                            Auto Fill Free preview
                          </Button>

                        </small>

                      <input
                        placeholder='License Key you received after purchasing book (check your email)'
                        className='col-12 mb-3 form-control'
                        name='licenseKey'
                        value={licenseKey}
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
const mapDispatchToProps = {
  updateEbookUserProfile,
};
const mapStateToProps = state => {
  return { ebookUserProfile: state.data.user.ebookUserProfile };
};

EbookPremiumBanner.propTypes = {
  // redux
  ebookUserProfile: PropTypes.shape({}),
  updateEbookUserProfile: PropTypes.func.isRequired,
};

export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(EbookPremiumBanner));

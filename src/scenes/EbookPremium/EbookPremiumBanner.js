import React, { useState, useEffect } from "react";
import { Button, Row } from "antd";
import "../Ebook/Ebook.scss";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EbookPremiumTabs from "./EbookPremiumTabs";
import UtilsAPI from "../../services/UtilsAPI";
import ResponseDisplay from "../../components/ResponseDisplay";
import { updateEbookUserProfile } from "../../redux/actions/user";

export const FREE_PREVIEW_EMAIL = 'preview@atila.ca';
export const FREE_PREVIEW_LICENSE_KEY = 'freepreview7';

const EbookPremiumBanner = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const ebookUserProfile = useSelector(state => state.data.user.ebookUserProfile);

  const params = new URLSearchParams(location.search);
  const initialEmail = params.get('email') || '';
  const initialLicenseKey = params.get('licenseKey') || '';

  const [email, setEmail] = useState(initialEmail);
  const [licenseKey, setLicenseKey] = useState(initialLicenseKey);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [responseError, setResponseError] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('ebookUserEmail');
    if (storedEmail) {
      dispatch(updateEbookUserProfile({ email: storedEmail }));
    }
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "licenseKey") setLicenseKey(value);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!email || !licenseKey) {
      setResponseError(`${!email ? 'Email' : 'License Key'} cannot be blank`);
      return;
    }

    setIsLoadingResponse(true);
    setResponseError(false);

    try {
      await UtilsAPI.authenticateEbookUser(email, licenseKey);
      localStorage.setItem("ebookUserEmail", email);
      dispatch(updateEbookUserProfile({ email, licenseKey }));
    } catch (err) {
      console.error(err);
      setResponseError(err.response ? err.response.data : err);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const autoFillPreview = (e) => {
    e.preventDefault();
    setEmail(FREE_PREVIEW_EMAIL);
    setLicenseKey(FREE_PREVIEW_LICENSE_KEY);
  };

  const loggedIn = ebookUserProfile?.email;

  return (
    <>
      {!loggedIn ? (
        <div className='vh-100 EbookPremiumBanner'>
          <div>
            <Row className='text-center'>
              <div className='container mt-5'>
                <div className='card shadow p-3'>
                  <div>
                    <h1>Login</h1>
                    <form className='row p-3' onSubmit={submitForm}>
                      <input
                        placeholder='Email you purchased the book with'
                        className='col-12 mb-3 form-control'
                        name='email'
                        value={email}
                        onChange={handleInputChange}
                      />
                      <small>
                        Hint: For a free preview use,
                        email: <code>{FREE_PREVIEW_EMAIL}</code>{' '}
                        License key: <code>{FREE_PREVIEW_LICENSE_KEY}</code>{' '}
                        <Button onClick={autoFillPreview} type="link">
                          Auto Fill Free preview
                        </Button>
                      </small>

                      <input
                        placeholder='License Key you received after purchasing book (check your email)'
                        className='col-12 mb-3 form-control'
                        name='licenseKey'
                        value={licenseKey}
                        onChange={handleInputChange}
                      />
                      <ResponseDisplay
                        isLoadingResponse={isLoadingResponse}
                        responseError={responseError}
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
                    </form>
                  </div>
                </div>
              </div>
            </Row>
          </div>
        </div>
      ) : (
        <EbookPremiumTabs />
      )}
    </>
  );
};

export default EbookPremiumBanner;

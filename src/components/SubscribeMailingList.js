import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Col, Row } from "antd";

import UtilsAPI from "../services/UtilsAPI";
import Loading from "./Loading";
import { InputConfigPropType } from "../models/Utils";
import FormDynamicInput from "./Form/FormDynamicInput";

const SubscribeMailingList = ({
  buttonText,
  skipSendEmail,
  formGoogleSheetName,
  subscribeText,
  successResponse,
  extraFormQuestions,
  onSubscribeClick
}) => {
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [errorReceivingResponse, setErrorReceivingResponse] = useState(false);
  const [isReceivedResponse, setIsReceivedResponse] = useState(false);
  const [formError, setFormError] = useState(null);

  const updateForm = (event) => {
    event.preventDefault();
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const submitContact = async (event) => {
    event.preventDefault();

    if (!formData.fullName || !formData.email) {
      setFormError('Full name and email is required');
      return;
    }

    setIsLoadingResponse(true);
    setFormError(null);

    const formDataPost = {
      formGoogleSheetName,
      referrer: location.pathname,
      ...formData,
      device: navigator.userAgent,
    };

    if (skipSendEmail) {
      formDataPost.skipSendEmail = skipSendEmail;
    }

    try {
      if (formGoogleSheetName === 'ebookMailingList') {
        await UtilsAPI.sendEbookPreviewEmail(formDataPost).catch((err) =>
          console.log({ err })
        );
      }

      await UtilsAPI.postGoogleScript(formDataPost);
      setIsReceivedResponse(true);
    } catch (err) {
      setErrorReceivingResponse(true);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  let pageContent;

  if (isLoadingResponse) {
    pageContent = (
      <Loading isLoading={true} title="Sending Form Please wait..." />
    );
  } else if (isReceivedResponse) {
    pageContent = successResponse;
  } else if (errorReceivingResponse) {
    pageContent = (
      <div className="text-center">
        <h4>
          Sorry, there was an error sending your form{' '}
          <span role="img" aria-label="sad face emoji">😕</span>
        </h4>
        <h6>
          Please send us an email at{' '}
          <a href="mailto:info@atila.ca" target="_blank" rel="noopener noreferrer">
            info@atila.ca
          </a>
        </h6>
      </div>
    );
  } else {
    pageContent = (
      <>
        {subscribeText}
        <form className="form-group" onSubmit={submitContact}>
          <Row gutter={16}>
            <Col xs={24} sm={12} className="my-3">
              <input
                className="form-control"
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={updateForm}
              />
            </Col>
            <Col xs={24} sm={12} className="my-3">
              <input
                className="form-control"
                placeholder="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={updateForm}
              />
            </Col>

            {extraFormQuestions.map((config) => (
              <Col key={config.keyName} span={24} className="my-3">
                <FormDynamicInput
                  model={formData}
                  inputConfig={config}
                  onUpdateForm={updateForm}
                />
              </Col>
            ))}
          </Row>

          {formError && (
            <p className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
              {formError}
            </p>
          )}

          <button
            className="btn btn-primary col-12 mb-3"
            type="submit"
            name="SubscribeBtn"
            onClick={onSubscribeClick}
          >
            {buttonText}
          </button>
        </form>
      </>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-3">
        {pageContent}
      </div>
    </div>
  );
};

SubscribeMailingList.defaultProps = {
  buttonText: 'Subscribe',
  skipSendEmail: true,
  subscribeText: (
    <p className="col-sm-12 col-md-6" style={{ fontSize: 'medium' }}>
      Subscribe to get updates on new{' '}
      <Link to="/scholarship">scholarships</Link>,{' '}
      <Link to="/blog">blog</Link> and{' '}
      <Link to="/essay">essays</Link>, and new product features.
    </p>
  ),
  formGoogleSheetName: 'mailinglist',
  successResponse: (
    <div className="text-center">
      <h4>
        Thanks for Subscribing{' '}
        <span role="img" aria-label="happy face emoji">🙂</span>
      </h4>
    </div>
  ),
  extraFormQuestions: [],
  onSubscribeClick: () => {},
};

SubscribeMailingList.propTypes = {
  buttonText: PropTypes.string,
  skipSendEmail: PropTypes.bool,
  formGoogleSheetName: PropTypes.string,
  subscribeText: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
  ]),
  successResponse: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
  ]),
  extraFormQuestions: PropTypes.arrayOf(InputConfigPropType),
  onSubscribeClick: PropTypes.func,
};

export default SubscribeMailingList;

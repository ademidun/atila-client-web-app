import React, { Component } from "react";
import { Col, Row } from "antd";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import { handleButtonClickEventFacebook } from "../../models/Utils";

class EmailSignUp extends Component {
  state = {
    audience: this.props.audience,
  };

  render() {
    const subscribeText = <h3>Enter Email to Receive your Free Preview</h3>;
    const links = [
      "https://i.imgur.com/RLc5YPU.png",
      "https://i.imgur.com/sXj8xYA.png",
    ];
    const { audience } = this.state;

    const extraFormQuestions = [
      {
        keyName: "preferredIndustry",
        placeholder: "What Industry chapter are you most interested in?",
        type: "select",
        options: ["Tech", "Investment Banking", "Consulting", "Biomedical"],
        hideLabel: true,
      },
    ];

    const successResponse = (
      <div
        className='text-center'
        style={{ height: "300px", marginTop: "150px" }}
      >
        <h4>
          Thanks for your Response
          <span role='img' aria-label='happy face emoji'>
            🙂
          </span>
        </h4>
        <h6>Check your email. You will receive your free preview shortly</h6>
      </div>
    );

    return (
      <Row className='row' style={{ width: "90%", left: "10%" }}>
        <Col md={12}>
          <div>
            <img
              src={links[audience - 1]}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              alt='Book cover'
            />
          </div>
        </Col>
        <Col md={12}>
          <SubscribeMailingList
            subscribeText={subscribeText}
            successResponse={successResponse}
            buttonText='Submit'
            formGoogleSheetName='ebookMailingList'
            extraFormQuestions={extraFormQuestions}
            skipSendEmail={false}
            onSubscribeClick={handleButtonClickEventFacebook}
          />
        </Col>
      </Row>
    );
  }
}

export default EmailSignUp;

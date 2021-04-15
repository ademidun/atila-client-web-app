import React from "react";
import { Col, Row } from "antd";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import {handleButtonClickEventFacebook} from "../../models/Utils";
import {EBOOK_AUDIENCE_IMAGES} from "../../models/Constants";

function EmailSignUp({audience}) {

    const subscribeText= (<h3>Enter Email to Receive your Free Preview</h3>);

    const extraFormQuestions = [
        {
            keyName: 'preferredIndustry',
            placeholder: 'What Industry are you interested in?',
            type: 'select',
            options: [
                'Tech',
                'Investment Banking',
                'Consulting',
                'Biomedical',
                "Other"
            ],
            hideLabel: true
        },
    ];

    const successResponse = (<div className="text-center" style={{ height: '300px', marginTop: '150px' }}>
        <h4>
            Thanks for your Response
            <span role="img" aria-label="happy face emoji">🙂</span>
        </h4>
        <h6>Check your email. You will receive your free preview shortly</h6>
    </div>);

  return (
    <Row className='row' style={{ width: '90%', left: '10%' }} id="preview">
      <Col md={12}>
        <div>
            <img
              src={EBOOK_AUDIENCE_IMAGES[audience || '1'].ebookMultipleDevices}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              alt='Book cover'
            />
        </div>
      </Col>
      <Col md={12}>
        <SubscribeMailingList subscribeText={subscribeText}
                              successResponse={successResponse}
                              buttonText="Submit"
                              formGoogleSheetName="ebookMailingList"
                              extraFormQuestions={extraFormQuestions}
                              skipSendEmail={false}
                              onSubscribeClick={handleButtonClickEventFacebook}/>
      </Col>
    </Row>
  );
}

export default EmailSignUp;

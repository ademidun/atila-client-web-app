import React from "react";
import { Col, Row } from "antd";
import SubscribeMailingList from "../../components/SubscribeMailingList";

function EmailSignUp() {

    const subscribeText= (<h3>Enter Email to Receive your Free Preview</h3>);
  return (
    <Row className='row' style={{ width: '90%', left: '10%' }}>
      <Col span={12}>
        <div>
            <img
              src='https://i.imgur.com/RLc5YPU.png'
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              alt='Book cover'
            />
        </div>
      </Col>
      <Col span={12}>
        <SubscribeMailingList subscribeText={subscribeText}
                              buttonText="Submit"
                              formGoogleSheetName="ebookMailingList"
                              skipSendEmail={false}/>
      </Col>
    </Row>
  );
}

export default EmailSignUp;

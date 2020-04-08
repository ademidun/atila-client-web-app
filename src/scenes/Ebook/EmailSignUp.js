import React from "react";
import { Col, Row } from "antd";
import SubscribeMailingList from "../../components/SubscribeMailingList";

function EmailSignUp() {
  return (
    <Row className='row'>
      <Col span={12}>
        <div>
          <div width={"75%"}>
            <img
              src='https://i.imgur.com/RLc5YPU.png'
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              alt='Book cover'
            />
          </div>
        </div>
      </Col>
      <Col span={12}>
        <SubscribeMailingList subscribeText="Enter Email to Receive your Free Preview"
                              formGoogleSheetName="ebookPreview" />
      </Col>
    </Row>
  );
}

export default EmailSignUp;

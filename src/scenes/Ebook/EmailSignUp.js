import React from "react";
import ContactUs from "../../components/ContactUs";
import { Col, Row } from "antd";

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
        <ContactUs title={"Enter Email to Receive your Free Preview"} />
      </Col>
    </Row>
  );
}

export default EmailSignUp;

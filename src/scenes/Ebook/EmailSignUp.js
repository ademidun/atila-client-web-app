import React from "react";
import ContactUs from "../../components/ContactUs";
import { Button, Col, Row } from "antd";

function EmailSignUp() {
  return (
    <Row className='row'>
      <Col span={12}>
        <div
          className='card '
          style={{
            backgroundColor: "#add8e6",
            //backgroundImage: "linear-gradient(-90deg, red, #f05e23)",
            border: "0px",
            borderColor: "transparent",
          }}
        >
          <div width={"75%"}>
            <img
              src='https://i.imgur.com/EH9wKtQ.png'
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              alt='Book cover'
            />
          </div>

          {/*<div className='col text-center'>
            <Button>
              <h1 style={{ color: "white" }}>Buy Now for $29.99</h1>
            </Button>
          </div>*/}
        </div>
      </Col>
      <Col span={12}>
        <ContactUs title={"Enter Email to Receive your Free Preview"} />
      </Col>
    </Row>
  );
}

export default EmailSignUp;

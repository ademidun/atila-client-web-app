// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Button, Col, Modal, Row} from "antd";
import {Link, withRouter} from "react-router-dom";
import BillingAPI from "../../services/BillingAPI";
import {connect} from "react-redux";


class PremiumCheckoutForm extends React.Component {

    constructor(props) {
        super(props);
        const { userProfile } = this.props;
        this.state = {
            isLoggedInModalVisible: !userProfile,
            cardHolderName: "",
            addressCountry: ""
        }
    }

    handleSubmit = (ev) => {
        ev.preventDefault();

        console.log({ev});

        const { stripe } = this.props;
        const { cardHolderName, addressCountry } = this.props;

        stripe
            .createToken({name: cardHolderName, address_country: addressCountry})
            .then(function(result) {
                console.log({result});

                if(result.token) {
                    BillingAPI.chargePayment(result.token.id)
                        .then(res => {
                            console.log({res});
                        })
                }
            });
    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };



    handleOk = e => {
        this.setState({
            isLoggedInModalVisible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            isLoggedInModalVisible: false,
        });
    };

    render() {

        const { userProfile } = this.props;
        const { isLoggedInModalVisible, cardHolderName, addressCountry } = this.state;
        const { location: { pathname, search } } = this.props;

        const redirectString = `?redirect=${pathname}${search}`;

        const loginToUsePremium = (<div className="center-block">
            <Link to={`/login${redirectString}`}>Login</Link>{' '} or {' '}
            <Link to={`/register${redirectString}`}>Register</Link>
            {' '} to continue with Atila Premium checkout
        </div>);
        const loginToUsePremiumTitle = "You Must be Logged In";
        if(!userProfile) {
            return (
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <Modal
                            visible={isLoggedInModalVisible}
                            title={loginToUsePremiumTitle}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    <Link to={`/login${redirectString}`}>Login</Link>
                                </Button>,
                                <Button key="submit" type="primary" onClick={this.handleOk}>
                                    <Link to={`/register${redirectString}`}>Register</Link>
                                </Button>,
                            ]}
                        >
                            {loginToUsePremium}
                        </Modal>
                    <h1>{loginToUsePremiumTitle}</h1>
                    {loginToUsePremium}
                    </div>
                </div>
            )
        }
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>Student Premium Checkout</h1>
                    <form onSubmit={this.handleSubmit}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} className="mb-3">
                                <input placeholder="Cardholder Name"
                                       name="cardHolderName"
                                       className="form-control"
                                       value={cardHolderName}
                                       onChange={this.updateForm}
                                />
                            </Col>
                            <Col xs={24} sm={12} className="mb-3">
                                <input placeholder="Card Country"
                                       name="addressCountry"
                                       className="form-control"
                                       value={addressCountry}
                                       onChange={this.updateForm}
                                />
                            </Col>
                            <Col span={24}>
                                <CardElement style={{base: {fontSize: '18px'}}} />
                            </Col>
                        </Row>

                        <Button className="col-12 my-3"
                                type="primary"
                        onClick={this.handleSubmit}>
                            Confirm order
                        </Button>

                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default injectStripe(withRouter(connect(mapStateToProps)(PremiumCheckoutForm)));
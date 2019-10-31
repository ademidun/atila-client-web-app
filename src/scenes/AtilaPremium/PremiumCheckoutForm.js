// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Button, Col, Row} from "antd";
import {withRouter} from "react-router-dom";
import BillingAPI from "../../services/BillingAPI";
import {connect} from "react-redux";
import {UserProfilePropType} from "../../models/UserProfile";
import SubscribeMailingList from "../../components/SubscribeMailingList";


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

        const { stripe, userProfile } = this.props;

        const { first_name, last_name, email } = userProfile;
        const { cardHolderName, addressCountry } = this.props;

        stripe
            .createToken({name: cardHolderName, address_country: addressCountry})
            .then(function(result) {
                console.log({result});

                const fullName = `${first_name} ${last_name}`;

                if(result.token) {
                    BillingAPI.chargePayment(result.token.id, fullName, email)
                        .then(res => {
                            console.log({res});
                        })
                        .catch( err => {
                            console.log({err});
                        })
                }
            });
    };

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    render() {

        const { userProfile } = this.props;
        const { cardHolderName, addressCountry } = this.state;

        const subscribeText = (<h3>
            Join the Waiting List. Get Notified When Atila Premium Launches
        </h3>);
        if(!userProfile || !userProfile.is_atila_admin) {
            return (
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <div className="text-center">
                            <h1>
                                Atila Premium Coming Soon
                                <span role="img" aria-label="eyes and clock emoji">👀 🕛</span>
                            </h1>

                            <SubscribeMailingList subscribeText={subscribeText}
                                                  btnText="Join Waiting List" />
                        </div>
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

PremiumCheckoutForm.defaultProps = {
    userProfile: null
};

PremiumCheckoutForm.propTypes = {
    userProfile: UserProfilePropType
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default injectStripe(withRouter(connect(mapStateToProps)(PremiumCheckoutForm)));
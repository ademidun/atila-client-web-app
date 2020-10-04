import React from 'react';
import {connect} from "react-redux";
import { Button, Col, Input, Row } from "antd";
import PaymentAPI from "../../services/PaymentAPI";
import Loading from "../../components/Loading";



class PaymentAccept extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
        }
    }
    connectBankAccount = (event) => {

        event.preventDefault();
        event.stopPropagation();

        const { userProfile } = this.props;

        const {first_name, last_name, email} = userProfile;

        this.setState({isLoading: "Connecting Bank Account"});

        PaymentAPI
            .createAccount({first_name, last_name, email})
            .then(res => {
                console.log({res});

                const { data: { redirect_url } } = res;
                console.log(redirect_url);
                // for some reason the auto redirect line below is not working
                window.location.href = redirect_url;
                // this.setState({redirectUrl: redirect_url})

            })
            .catch(err => {
                console.log({err})
            })
            .finally(() => {
                console.log("finally");
                this.setState({isLoading: null});
            });


    };

    render () {

        const { userProfile } = this.props;
        const { isLoading } = this.state;

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    {isLoading &&
                    <Loading title={isLoading} />
                    }
                    <div>
                        <h1>Connect Your Bank Account</h1>
                        <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                            <Col span={24}>
                                <Input value={userProfile.first_name} disabled={true} />
                            </Col>
                            <Col span={24}>
                                <Input value={userProfile.last_name} disabled={true} />
                            </Col>
                            <Col span={24}>
                                <Input value={userProfile.email} disabled={true}/>
                            </Col>
                            <Col span={24}>
                                <Button onClick={this.connectBankAccount}
                                        className="center-block"
                                        type="primary"
                                        disabled={isLoading}>
                                    Connect with Stripe (Step 1)
                                </Button>
                            </Col>

                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(PaymentAccept);

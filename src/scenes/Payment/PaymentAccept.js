import React from 'react';
import {connect} from "react-redux";
import {Button, Col, Input, Row, Steps} from "antd";
import PaymentAPI from "../../services/PaymentAPI";
import Loading from "../../components/Loading";
import UserProfileAPI from "../../services/UserProfileAPI";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import { prettifyKeys} from "../../services/utils";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {Link} from "react-router-dom";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import CKEditor from "@ckeditor/ckeditor5-react";
import {toastNotify} from "../../models/Utils";

const { Step } = Steps;

const ALL_PAYMENT_ACCEPTANCE_STEPS = ["verify_email", "security_question", "proof_of_enrolment", "thank_you_email","accept_payment"];

class PaymentAccept extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
            application: null,
            scholarship: null,
            currentPaymentAcceptanceStepIndex: 0
        }
    }

    componentDidMount() {
        this.getApplication();
    }

    getApplication = () => {
        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);

        let applicationID = params.get('application');
        this.setState({isLoading: "Retrieving Application..."});
        ApplicationsAPI.get(applicationID)
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship})
                this.getCurrentStep()
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoading: null});
            })
    };

    linkBankAccount = (event=null) => {

        if(event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { userProfile } = this.props;

        const { first_name, last_name, email } = userProfile;

        this.setState({isLoading: "Connecting Bank Account"});

        const accountData = {
            user_profile: { first_name, last_name, email },
            return_url: window.location.href,
            refresh_url: window.location.href,
        };
        PaymentAPI
            .createAccount(accountData)
            .then(res => {

                const { data: { redirect_url, account_id } } = res;
                this.saveUserConnectedAccountId(account_id, redirect_url);
            })
            .catch(err => {
                console.log({err});
                this.setState({isLoading: null});
            })
            .finally(() => {
            });


    };

    saveUserConnectedAccountId = (account_id, redirect_url) => {
        const { userProfile, updateLoggedInUserProfile } = this.props;

        const {user} = userProfile;
        this.setState({isLoading: "Saving User Profile"});
        UserProfileAPI
            .patch({stripe_connected_account_id: account_id}, user)
            .then(res => {
                updateLoggedInUserProfile(res.data);
                window.location.href = redirect_url;
            })
            .catch(err => {
                console.log({err})
            })
            .finally(() => {
                this.setState({isLoading: null});
            });
    };

    acceptPayment = () => {
        this.setState({isLoading: "Accepting Payment"});

        const { userProfile } = this.props;
        const { scholarship } = this.state;

        const transferData = {
            user_profile: { id: userProfile.user },
            scholarship: { id: scholarship.id },
        };
        PaymentAPI
            .transferPayment(transferData)
            .then(res => {
                this.updateScholarship()
                this.updateApplication()
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoading: null});
            });

    };

    getCurrentStep = () => {
        const { application } = this.state;
        const { userProfile } = this.props

        if (application.is_thank_you_letter_sent){
            this.setState({currentPaymentAcceptanceStepIndex: 4})
        }
        else if (userProfile.enrollment_proof){
            this.setState({currentPaymentAcceptanceStepIndex: 3})
        }
        else if (application.is_security_question_answered){
            this.setState({currentPaymentAcceptanceStepIndex: 2})
        }
        else if (application.is_email_verified){
            this.setState({currentPaymentAcceptanceStepIndex: 1})
        }
        else {
            this.setState({currentPaymentAcceptanceStepIndex: 0})
        }
    }

    updateScholarship = () => {
        // This function sets Scholarship.is_payment_accepted to True
        const { scholarship } = this.state;

        ScholarshipsAPI
            .patch(scholarship.id, {is_payment_accepted: true})
            .then(res => {
            })
            .catch(err => {
                console.log({err});
            })
    }

    updateApplication = () => {
        // This function sets Application.accepted_payment to True
        const { application } = this.state;

        ApplicationsAPI
            .patch(application.id, {accepted_payment: true})
            .then(res => {
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
            })
            .catch(err => {
                console.log({err});
            })
    }

    resendVerificationEmail = () => {
        // This function sends a verification email to the application email.

        const { application } = this.state
        const applicationID = application.id

        this.setState({isLoading: "Sending Verification Email..."});
        ApplicationsAPI
            .resendVerificationEmail(applicationID, {})
            .then(res=>{
                const { application } = res.data;
                const { scholarship } = res.data;

                this.setState({application, scholarship});

                toastNotify('😃 Email was successfully sent! Check your inbox and spam for a verification code.')
            })
            .catch(err => {
                console.log({err});
                toastNotify(`🙁 An error occured, check your connection!`, 'error');
            })
            .finally(() => {
                this.setState({isLoading: null});
            })
    }

    verifyEmailCode = (code) => {
        // This function verifies the email code typed in

        const { application } = this.state
        const applicationID = application.id

        this.setState({isLoading: "Verifying Code..."});
        ApplicationsAPI
            .verifyEmailCode(applicationID, {verification_code: code})
            .then(res=> {
                const {application} = res.data;
                const {scholarship} = res.data;
                const {result} = res.data;

                this.setState({application, scholarship});

                if (result === "success"){
                    toastNotify('😃 Email Verification Successful')
                }
                else {
                    toastNotify(`🙁 That wasn't the code we're looking for. Try again or resend verification code!`, 'error');
                }

                this.getCurrentStep()
            })
            .catch(err => {
                    console.log({err});
                    toastNotify(`🙁 An error occured, check your connection!`, 'error');
            })
            .finally(() => {
                this.setState({isLoading: null});
            })
    }

    verifyEmailStep = () => {
        const { userProfile } = this.props
        const { isLoading } = this.state

        return (
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
                    <Input id="code" placeholder="Email Verification Code" />
                </Col>
                <Col span={24}>
                    <Button onClick={()=>{this.resendVerificationEmail()}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={isLoading}
                    >
                        Resend Email Verification Code
                    </Button>
                    {/*There might be a cleaner method to reference the input value than
                    document.getElementById('code').value.*/}
                    <Button onClick={()=>{this.verifyEmailCode(document.getElementById('code').value)}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={isLoading}
                    >
                        Verify Email
                    </Button>
                </Col>
            </Row>
        )
    }

    securityQuestionStep = () => {
        return (
            <div>Security Question Step Template</div>
        )
    }

    proofOfEnrolmentStep = () => {
        return (
            <div>Proof of Enrolment Step Template</div>
        )
    }

    thankYouEmailStep = () => {
        const { isLoading } = this.state

        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Col span={24}>
                    <CKEditor
                        editor={ InlineEditor }
                        data={"Thank You Letter"}
                    />
                </Col>
                <Col span={24}>
                    <Button onClick={()=>{}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={isLoading}>
                        Send Thank You Email
                    </Button>
                </Col>
            </Row>
        )
    }

    acceptPaymentStep = () => {
        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <div className="center-block">
                    <p className="text-success">
                        Success! You've completed the payment acceptance step and your money will be
                        sent to you within 24 hours.
                    </p>
                </div>
            </Row>
        )
    }

    render () {

        const { userProfile } = this.props;
        const { isLoading, application, scholarship, currentPaymentAcceptanceStepIndex } = this.state;

        if (!userProfile) {
            return (
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <h1>You must be logged in to accept scholarship awards</h1>
                    </div>
                </div>
            )
        }

        if (!application) {
            return (
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        {isLoading &&
                        <Loading title={isLoading} />
                        }
                    </div>
                </div>
            )
        }

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    {isLoading &&
                    <Loading title={isLoading} />
                    }
                    <Steps type="navigation"
                        current={ALL_PAYMENT_ACCEPTANCE_STEPS
                            .findIndex(step => step === ALL_PAYMENT_ACCEPTANCE_STEPS[currentPaymentAcceptanceStepIndex])}>
                        {ALL_PAYMENT_ACCEPTANCE_STEPS.map(paymentAcceptanceStep => (
                            <Step key={paymentAcceptanceStep} title={prettifyKeys(paymentAcceptanceStep)} />
                        ))}
                    </Steps>
                    <div>
                        <h1>Accept Your Award for
                            <Link to={`/scholarship/${scholarship.slug}`}> {scholarship.name}</Link>
                        </h1>

                        {(currentPaymentAcceptanceStepIndex=== 0) && this.verifyEmailStep()}
                        {(currentPaymentAcceptanceStepIndex === 1) && this.securityQuestionStep()}
                        {(currentPaymentAcceptanceStepIndex === 2) && this.proofOfEnrolmentStep()}
                        {(currentPaymentAcceptanceStepIndex === 3) && this.thankYouEmailStep()}
                        {(currentPaymentAcceptanceStepIndex === 4) && this.acceptPaymentStep()}

                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = {
    updateLoggedInUserProfile
};
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentAccept);

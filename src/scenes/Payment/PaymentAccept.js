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
            currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[0],
            currentPaymentAcceptanceStepIndex: 0,
            application: null,
            scholarship: null,
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
                this.setState({application, scholarship}, () => {
                    this.updateCurrentPaymentAcceptanceStep();
                });
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoading: null});
            })
    };

    setPaymentThankYouEmail = (event) => {

        event.preventDefault();

        let { application } = this.state;

        application = {
            ...application,
            is_thank_you_email_sent: event.target.checked,
        };

        this.setState({application}, () => {
            this.updateCurrentPaymentAcceptanceStep();
        });

    };

    updateCurrentPaymentAcceptanceStep = () => {


        const { userProfile } = this.props;
        const { application } = this.state;
        if (!application.is_thank_you_email_sent) {
            // User has not sent a thank you email, so ask them to go and do that first.
            this.setState({currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[0]});

        }
        else if (!userProfile.stripe_connected_account_id) {
            // User has not linked their bank account yet so they need to do that first.
            this.setState({currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[1]});
        } else {
            // User already has a Stripe Connected Account, so their bank account is already linked.
            // // Time to Accept Payment
            // 1. Get Application Details and Scholarship Funding Amount
            // 2. Send a transfer request to move <scholarship.funding_amount from Atila's bank account to
            // the student's account

            this.setState({currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[2]})
        }
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
                this.setState({currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[2]});
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

    nextStep = () => {
        const { currentPaymentAcceptanceStepIndex, currentPaymentAcceptanceStep } = this.state;

        this.setState({
            isLoading: `Loading ${prettifyKeys(currentPaymentAcceptanceStep)} step`,
        });

        setTimeout(() => {

            this.setState({
                currentPaymentAcceptanceStepIndex: currentPaymentAcceptanceStepIndex + 1,
                currentPaymentAcceptanceStep: ALL_PAYMENT_ACCEPTANCE_STEPS[currentPaymentAcceptanceStepIndex + 1],
                isLoading: false
            })

        }, 1000);


    };

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

    sendVerificationEmail = () => {
        const { application } = this.state
        const applicationID = application.id

        this.setState({isLoading: "Sending Verification Email..."});
        ApplicationsAPI
            .sendVerificationEmail(applicationID, {})
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;

                this.afterSaveApplication(application, scholarship);
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
        const { application, isLoading } = this.state

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
                    <Input value={application.accept_payment_email_verification_code}
                           placeholder="Email Verification Code"
                    />
                </Col>
                <Col span={24}>
                    <Button onClick={()=>{this.nextStep()}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={isLoading}
                    >
                        Send Email Verification Code
                    </Button>
                    <Button onClick={()=>{this.nextStep()}}
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
                    <Button onClick={()=>{this.nextStep()}}
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
            <div>Accept Payment Step Template</div>
        )
    }

    render () {

        const { userProfile } = this.props;
        const { isLoading, currentPaymentAcceptanceStep, application, scholarship } = this.state;

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
                            .findIndex(step => step === currentPaymentAcceptanceStep)}>
                        {ALL_PAYMENT_ACCEPTANCE_STEPS.map(paymentAcceptanceStep => (
                            <Step key={paymentAcceptanceStep} title={prettifyKeys(paymentAcceptanceStep)} />
                        ))}
                    </Steps>
                    <div>
                        <h1>Accept Your Award for
                            <Link to={`/scholarship/${scholarship.slug}`}> {scholarship.name}</Link>
                        </h1>

                        {(application.current_payment_acceptance_step_index === 0) && this.verifyEmailStep()}
                        {(application.current_payment_acceptance_step_index === 1) && this.securityQuestionStep()}
                        {(application.current_payment_acceptance_step_index === 2) && this.proofOfEnrolmentStep()}
                        {(application.current_payment_acceptance_step_index === 3) && this.thankYouEmailStep()}
                        {(application.current_payment_acceptance_step_index === 4) && this.acceptPaymentStep()}

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

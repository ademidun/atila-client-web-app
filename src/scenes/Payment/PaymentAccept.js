import React from 'react';
import {connect} from "react-redux";
import {Button, Col, Input, Popconfirm, Row, Steps} from "antd";
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
import FileInput from "../../components/Form/FileInput";

const { Step } = Steps;

const ALL_PAYMENT_ACCEPTANCE_STEPS = ["verify_email", "security_question", "proof_of_enrolment", "thank_you_email", "accept_payment"];

class PaymentAccept extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            application: null,
            scholarship: null,
            thankYouLetterMessage: "" // This state variable is only applicable for sendThankYouEmail step.
            // Another method is to have sendThankYouEmail in it's own component, and put that state in there.
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
        this.setState({loading: "Retrieving Application..."});
        ApplicationsAPI.get(applicationID)
            .then(res=>{
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
                const { thank_you_letter } = application;
                this.setState({thankYouLetterMessage: thank_you_letter});
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({loading: null});
            })
    };

    linkBankAccount = (event=null) => {

        if(event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { userProfile } = this.props;

        const { first_name, last_name, email } = userProfile;

        this.setState({loading: "Connecting Bank Account"});

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
                this.setState({loading: null});
            })
            .finally(() => {
            });


    };

    saveUserConnectedAccountId = (account_id, redirect_url) => {
        const { userProfile, updateLoggedInUserProfile } = this.props;

        const {user} = userProfile;
        this.setState({loading: "Saving User Profile"});
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
                this.setState({loading: null});
            });
    };

    acceptPayment = () => {
        this.setState({loading: "Accepting Payment"});

        const { userProfile } = this.props;
        const { scholarship } = this.state;

        const transferData = {
            user_profile: { id: userProfile.user },
            scholarship: { id: scholarship.id },
        };
        PaymentAPI
            .transferPayment(transferData)
            .then(res => {
                this.updateScholarship();
                this.updateApplication()
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({loading: null});
            });

    };

    /**
     * It's worth explaining how the page updates after each step without a refresh.
     * 1) A network request is made (patch, post, etc).
     * 2) On the .then(), you setState with the new updated application object that's returned from the request
     * 3) The setState causes a re-render. In the render method, this function is called which deduces the current step.
     * 4) The new step renders :)
     * @returns {number}
     */
    getCurrentStep = () => {
        /*
        */

        const { application } = this.state;
        const { userProfile } = this.props;

        if (application.is_thank_you_letter_sent){
            return 4
        }
        if (userProfile.enrollment_proof && application.is_security_question_answered){
            return 3
        }
        if (application.is_security_question_answered){
            return 2
        }
        if (application.is_email_verified){
            return 1
        }

        // If all the above is false, you're at the first step
        return 0
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
    };

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
    };

    updateUserProfile = (userProfileUpdateData) => {
        const { userProfile } = this.props;

        this.setState({loading: "Updating User Profile..."}); // loading isn't true/false remember to switch that in new pr.
        UserProfileAPI.patch(
            userProfileUpdateData, userProfile.user)
            .then(res => {
                console.log('res.data', res.data);
                updateLoggedInUserProfile(res.data);
            })
            .catch(err=> {
                console.log({err});
            })
            .finally(() => {
                this.setState({loading: null});
            });
    };

    goBack = () => {
        // This is a function for testing, you can ignore it
        const { application } = this.state;

        ApplicationsAPI
            .patch(application.id, {is_email_verified: false, is_security_question_answered: false})
            .then(res => {
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
            })
            .catch(err => {
                console.log({err});
            })
    };

    resendVerificationEmail = () => {
        // This function sends a verification email to the application email.

        const { application } = this.state;
        const applicationID = application.id;

        this.setState({loading: "Sending Verification Email..."});
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
                toastNotify(`An error occurred. Please message us using the chat button in the bottom right.`, 'error');
            })
            .finally(() => {
                this.setState({loading: null});
            })
    };

    verifyEmailCode = (code) => {
        // This function verifies the email code typed in

        const { application } = this.state;
        const applicationID = application.id;

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
                    toastNotify(`🙁 That wasn't the code we're looking for. Try again or resend verification code`, 'error');
                }
            })
            .catch(err => {
                    console.log({err});
                    toastNotify(`An error occurred. Please message us using the chat button in the bottom right.`, 'error');
            })
            .finally(() => {})
    };

    verifyEmailStep = () => {
        const { userProfile } = this.props;
        const { loading } = this.state;

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
                            disabled={loading}
                    >
                        Resend Email Verification Code
                    </Button>
                    {/*There might be a cleaner method to reference the input value than
                    document.getElementById('code').value.*/}
                    <Button onClick={()=>{this.verifyEmailCode(document.getElementById('code').value)}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={loading}
                    >
                        Verify Email
                    </Button>
                </Col>
            </Row>
        )
    };

    updateApplicationIsSecurityQuestionAnswered = () => {
        const { application } = this.state;

        ApplicationsAPI
            .patch(application.id, {is_security_question_answered: true})
            .then(res => {
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
            })
            .catch(err => {
                console.log({err});
            })
    };

    verifySecurityQuestionAnswer = (attempt) => {
        const { userProfile } = this.props;

        const userProfileAttempt = {
            security_question_answer_attempt: attempt,
        };

        this.setState({loading: "Verifying Answer..."});
        UserProfileAPI
            .verifySecurityAnswer(userProfileAttempt, userProfile.user)
            .then(res => {
                toastNotify(`😃 Security Answer Verification Successful`, 'success');
                this.updateApplicationIsSecurityQuestionAnswered()
            })
            .catch(err => {
                toastNotify(`Incorrect Attempt. Try again or message us using the chat button in the bottom right if this persists.`, 'error');
                console.log({err});

            })
            .finally(() => {
                this.setState({loading: null})
            })
    };

    securityQuestionStep = () => {
        const { loading } = this.state;
        const { userProfile } = this.props;

        const title  = "Verify Security Question and Answer";

        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Col span={24}>
                    <h3 className="text-center">
                        {title}
                    </h3>
                </Col>
                <Col span={24}>
                    <h3>Security Question: {userProfile.security_question}</h3>
                </Col>
                <Col span={24}>
                    <b>Response</b> <Input id="security-question-response" placeholder="Security Question Reponse" />
                </Col>
                <Col span={24}>
                    <Button onClick={()=>
                    {this.verifySecurityQuestionAnswer(document.getElementById('security-question-response').value)}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={loading}
                    >
                        Verify Security Question Answer
                    </Button>
                </Col>

                <Col span={24}>
                    <div>
                        <Button onClick={()=>{this.goBack()}}
                                className="center-block mt-3"
                                type="primary"
                                disabled={loading}
                        >
                            Go Back
                        </Button>
                    </div>
                </Col>
            </Row>

        )
    };

    onEnrollmentUpload = (event) => {

        const userProfileUpdateData = {
            [event.target.name]: event.target.value
        };

        console.log({userProfileUpdateData});

        this.updateUserProfile(userProfileUpdateData);
    };

    proofOfEnrolmentStep = () => {
        const title  = "Upload Proof of Enrollment";
        const { userProfile } = this.props;

        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Col span={24}>
                    <h3 className="text-center">
                        {title}
                    </h3>
                </Col>
                <Col span={24}>
                    <FileInput
                        title={title}
                        keyName="enrollment_proof"
                        onChangeHandler={this.onEnrollmentUpload}
                        type="image,pdf"
                        filePath={`user-profile-files/${userProfile.user}`}
                        uploadHint="Enrollment proof must be a PDF (preferred) or an image."/>
                </Col>
                {userProfile.enrollment_proof &&
                <Col span={24}>
                    <a href={userProfile.enrollment_proof}  target="_blank" rel="noopener noreferrer">
                        View your Enrollment Proof
                    </a>
                </Col>}
            </Row>
        )
    };

    saveThankYouLetter = () => {
        const { application, thankYouLetterMessage } = this.state;

        ApplicationsAPI
            .patch(application.id, {thank_you_letter: thankYouLetterMessage})
            .then(res => {
                const { data: application } = res;
                const { scholarship } = application;
                this.setState({application, scholarship});
                toastNotify('😃 Thank you letter draft saved!');
            })
            .catch(err => {
                console.log({err});
            })
    }

    sendThankYouLetter = (letter) => {
        this.setState({loading: "Sending thank you email..."})
        const { application } = this.state

        ApplicationsAPI
            .sendThankYouLetter(application.id, {thank_you_letter: letter})
            .then(res => {
                const {application} = res.data;
                const {scholarship} = res.data;
                this.setState({application, scholarship});

                toastNotify(`😃 Thank you letter sent successfully!`, 'success');
            })
            .catch(err => {
                console.log({err})
                toastNotify(`An error occurred. Please message us using the chat button in the bottom right.`, 'error');
            })
            .finally(() =>{
                this.setState({loading: null})
            })
    }

    editorChange = ( event, editor ) => {
        const data = editor.getData();
        this.setState({thankYouLetterMessage: data});
    };

    thankYouEmailStep = () => {
        const { loading, application, thankYouLetterMessage } = this.state;
        const confirmText = "Are you sure you want to send the email? This action cannot be undone."

        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Col span={24}>
                    <p>
                        Here is a <a href="https://docs.google.com/document/d/1-h9RWUv18P2Pq4WG3Y1hhvCSvw6L6b1acv83XrcAyKQ/edit"
                                     target="_blank" rel="noopener noreferrer">Sample Thank You Letter.</a>
                    </p>
                    <CKEditor
                        editor={ InlineEditor }
                        data={application.thank_you_letter}
                        onChange={ this.editorChange }
                    />
                </Col>
                <Col span={24}>
                    <Button onClick={()=>{this.saveThankYouLetter()}}
                            className="mt-3"
                            type="primary"
                            disabled={loading}>
                        Save
                    </Button>
                </Col>
                <Col span={24}>
                    <Popconfirm placement="bottom" title={confirmText} onConfirm={()=>{this.sendThankYouLetter(thankYouLetterMessage)}}
                                okText="Yes" cancelText="No">
                        <Button className="center-block mt-3"
                                type="primary"
                        >
                            Send Thank You Email...
                        </Button>
                    </Popconfirm>
                </Col>

                <Col span={24}>
                    <div>
                        <Button onClick={()=>{this.goBack()}}
                                className="center-block mt-3"
                                type="primary"
                                disabled={loading}
                        >
                            Go Back
                        </Button>
                    </div>
                </Col>
            </Row>
        )
    };

    onAcceptPayment = (email) => {
        // This function sends a post request to the accept-payment backend endpoint containing the accept_payment_email

        const { application } = this.state;

        ApplicationsAPI
            .acceptPayment(application.id, {"accept_payment_email": email})
            .then(res=> {
                const {application} = res.data;
                const {scholarship} = res.data;
                this.setState({application, scholarship});
            })
            .catch(err => {
                console.log({err});
                toastNotify(`An error occurred. Please message us using the chat button in the bottom right.`, 'error');
            })
            .finally(() => {})
    };

    acceptPaymentStep = () => {
        const { application } = this.state;
        const confirmText = "Are you sure this is the correct email to receive the scholarship funding?";

        if (application.is_payment_accepted){
            return (
                <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                    <Col span={24}>
                        <div className="center-block">
                            <p className="text-success">
                                Success! You've completed the payment acceptance step and your money will be
                                sent to {application.accept_payment_email} within 24 hours. Message us using the chat
                                icon in the bottom right if you have any questions!
                            </p>
                        </div>
                    </Col>
                </Row>
            )
        }
        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Col span={24}>
                    <h6>
                        Set destination email to receive payment.
                    </h6>
                </Col>

                <Col span={24}>
                    <Input id="accept-payment-email" placeholder="Destination Email" />
                </Col>

                <div className="center-block">
                    <Popconfirm placement="bottom" title={confirmText} onConfirm={() =>
                                {this.onAcceptPayment(document.getElementById('accept-payment-email'.value))}}
                                okText="Yes" cancelText="No">
                        <Button className="btn-success">
                            Accept Payment...
                        </Button>
                    </Popconfirm>
                </div>
            </Row>
        )

    };

    render () {

        const { userProfile } = this.props;
        const { loading, application, scholarship } = this.state;

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
                        {loading &&
                        <Loading title={loading} />
                        }
                    </div>
                </div>
            )
        }

        let currentPaymentAcceptanceStepIndex = this.getCurrentStep();
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    {loading &&
                    <Loading title={loading} />
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

                        {(currentPaymentAcceptanceStepIndex === 0) && this.verifyEmailStep()}
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

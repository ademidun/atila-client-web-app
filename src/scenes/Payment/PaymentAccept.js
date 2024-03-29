import React from 'react';
import {connect} from "react-redux";
import {Button, Col, Input, Popconfirm, Row, Steps} from "antd";
import Loading from "../../components/Loading";
import UserProfileAPI from "../../services/UserProfileAPI";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import {Link} from "react-router-dom";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import CKEditor from "@ckeditor/ckeditor5-react";
import {toastNotify} from "../../models/Utils";
import moment from "moment";

import "../../index.scss";
import { NOT_LOGGED_IN_PAYMENT_ACCEPT_ERROR, UNAUTHORIZED_TO_VIEW_PAGE } from '../../models/ConstantsErrors';

const { Step } = Steps;

let autoSaveTimeoutId;
class PaymentAccept extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            verificationCode: "",
            securityQuestionResponse: "",
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

    /**
     * It's worth explaining how the page updates after each step without a refresh.
     * 1) A network request is made (patch, post, etc).
     * 2) On the .then(), you setState with the new updated application object that's returned from the request
     * 3) The setState causes a re-render. In the render method, this function is called which deduces the current step.
     * 4) The new step renders :)
     * @returns {number}
     */
    getCurrentStep = () => {
        const { application } = this.state;

        if (application.is_thank_you_letter_sent){
            return 3
        }
        if (application.is_security_question_answered && application.is_email_verified){
            return 2
        }
        if (application.is_email_verified){
            return 1
        }

        // If all the above is false, you're at the first step
        return 0
    };

    updateUserProfile = (userProfileUpdateData) => {
        const { userProfile, updateLoggedInUserProfile } = this.props;

        this.setState({loading: "Updating User Profile..."}); // loading isn't true/false remember to switch that in new pr.
        UserProfileAPI.patch(
            userProfileUpdateData, userProfile.user)
            .then(res => {
                updateLoggedInUserProfile(res.data);
            })
            .catch(err=> {
                console.log({err});
            })
            .finally(() => {
                this.setState({loading: null});
            });
    };

    /*goBack = () => {
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
    };*/

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
                    toastNotify(`Incorrect code. Try again or 
                    request a resend of your email verification code.`, 'error');
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
        const { application, loading, verificationCode } = this.state;

        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Col span={24}>
                    <Input value={userProfile.first_name} disabled={true} />
                </Col>
                <Col span={24}>
                    <Input value={userProfile.last_name} disabled={true} />
                </Col>
                <Col span={24}>
                    <Input value={application.verification_email} disabled={true}/>
                </Col>
                <Col span={24}>
                    <Input value={verificationCode} placeholder="Email Verification Code"
                           onChange={e => this.setState({verificationCode: e.target.value})} />
                </Col>
                <Col span={24}>
                    <Button onClick={()=>{this.verifyEmailCode(verificationCode)}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={loading}
                    >
                        Verify Email
                    </Button>
                    <br />
                    <Button onClick={()=>{this.resendVerificationEmail()}}
                            className="center-block mt-3"
                            type="primary"
                            disabled={loading}
                    >
                        Resend Email Verification Code
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
                    {!userProfile.security_question &&
                        <p className="text-muted">
                            You're missing a security question and answer.<br/>

                            You may <Link to="/profile/edit#security">add one in your profile.</Link><br/>

                            We recommend setting a security question BEFORE submitting your application
                            for better security.
                        </p>
                    }
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
                        {/*<Button onClick={()=>{this.goBack()}}*/}
                        {/*        className="center-block mt-3"*/}
                        {/*        type="primary"*/}
                        {/*        disabled={loading}*/}
                        {/*>*/}
                        {/*    Go Back*/}
                        {/*</Button>*/}
                    </div>
                </Col>
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
            })
            .catch(err => {
                console.log({err});
            })
    };

    sendThankYouLetter = (letter) => {
        this.setState({loading: "Sending thank you email..."});
        const { application } = this.state;

        ApplicationsAPI
            .sendThankYouLetter(application.id, {thank_you_letter: letter})
            .then(res => {
                const {application} = res.data;
                const {scholarship} = res.data;
                this.setState({application, scholarship});

                toastNotify(`😃 Thank you letter sent successfully!`, 'success');
            })
            .catch(err => {
                console.log({err});
                toastNotify(`An error occurred. Please message us using the chat button in the bottom right.`, 'error');
            })
            .finally(() =>{
                this.setState({loading: null})
            })
    };

    editorChange = ( event, editor ) => {
        const data = editor.getData();
        this.setState({thankYouLetterMessage: data}, () => {
            if (autoSaveTimeoutId) {
                clearTimeout(autoSaveTimeoutId);
            }
            autoSaveTimeoutId = setTimeout(() => {
                // Runs 1 second (1000 ms) after the last change
                this.saveThankYouLetter();
            }, 1000);
        });
    };

    thankYouEmailStep = () => {
        const { application, thankYouLetterMessage, loading } = this.state;
        const confirmText = "Are you sure you want to send the letter? This action cannot be undone.";

        let dateModified;
        if (application.date_modified) {
            dateModified = new Date(application.date_modified);
            dateModified = moment(dateModified).format("dddd, MMMM Do YYYY, h:mm:ss a");
            dateModified =  (<p className="text-muted float-left">
                Last Auto-Saved: {dateModified}
            </p>)
        } else {
            dateModified =  (<p className="text-muted float-left">
                Start typing and your thank you letter will automatically save
            </p>)
        }

        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Col span={24}>
                    <p>
                        Here is a <a href="https://docs.google.com/document/d/1-h9RWUv18P2Pq4WG3Y1hhvCSvw6L6b1acv83XrcAyKQ/edit"
                                     target="_blank" rel="noopener noreferrer">Sample Thank You Letter.</a> <br/>

                         Start typing your thank you letter below:
                    </p>
                    <CKEditor
                        editor={ InlineEditor }
                        data={application.thank_you_letter}
                        onChange={ this.editorChange }
                    />
                </Col>
                <Col span={24}>
                    {dateModified}
                </Col>
                <Col span={24}>
                    {loading &&
                    <Loading title={loading} />
                    }
                    {application.is_thank_you_letter_sent &&
                        <p className="text-success">
                            Your thank you letter has been received and if you completed all the steps successfully,
                            you should receive your award within 24 hours.
                        </p>
                    }
                    {!application.is_thank_you_letter_sent &&
                        <Popconfirm placement="top"
                            // placement="top" was chosen because thank you letter is already
                            // at the bottom of the screen.
                            // If "bottom" was used the confirm dialog was less visible.
                                    title={confirmText}
                                    onConfirm={()=>{this.sendThankYouLetter(thankYouLetterMessage)}}
                                    okText="Yes" cancelText="No">
                            <Button className="center-block mt-3"
                                    type="primary"
                                    disabled={loading}
                            >
                                Send Thank You Letter...
                            </Button>
                        </Popconfirm>
                    }
                </Col>

                <Col span={24}>
                    <div>
                        {/*<Button onClick={()=>{this.goBack()}}*/}
                        {/*        className="center-block mt-3"*/}
                        {/*        type="primary"*/}
                        {/*        disabled={loading}*/}
                        {/*>*/}
                        {/*    Go Back*/}
                        {/*</Button>*/}
                    </div>
                </Col>
            </Row>
        )
    };

    onAcceptEmailChange = (event) => {
        let value = event.target.value;

        const { application } = this.state;

        this.setState({application: {
                                ...application,    // keep all other key-value pairs
                                accept_payment_email: value
        }});
    };

    onAcceptPayment = () => {
        // This function sends a post request to the accept-payment backend endpoint containing the accept_payment_email

        const { application } = this.state;
        const { accept_payment_email } = application;
        this.setState({loading: "Accepting payment email..."});

        ApplicationsAPI
            .acceptPayment(application.id, {accept_payment_email})
            .then(res=> {
                const {application} = res.data;
                const {scholarship} = res.data;
                this.setState({application, scholarship});
            })
            .catch(err => {
                console.log({err});
                toastNotify(`An error occurred. Please message us using the chat button in the bottom right.`, 'error');
            })
            .finally(() => {
                this.setState({loading: null})
            })
    };

    acceptPaymentStep = () => {
        const { application, loading, scholarship } = this.state;
        const confirmText = "Are you sure this is the correct email to receive the scholarship funding?";

        return (
            <Row gutter={[{ xs: 8, sm: 16}, 16]}>
                <Loading isLoading={loading} title={loading} />
                {application.is_payment_accepted &&
                    <Col span={24}>
                        <div className="center-block p-3">
                            <p className="text-muted">
                                Success! You've completed the payment acceptance step and your scholarship award will be
                                sent to {application.accept_payment_email} within 24 hours. Message us using the chat
                                icon in the bottom right or email info@atila.ca if you have any questions!
                            </p>
                        </div>
                    </Col>
                }
                {!application.is_payment_accepted &&
                <>
                    <Col span={24}>
                        <h6>
                            Set destination email to receive payment via Interac e-transfer.
                        </h6>
                    </Col>

                    <Col span={24}>
                        <Input id="accept_payment_email"
                               placeholder="Destination Email"
                               value={application.accept_payment_email}
                               onChange={this.onAcceptEmailChange} />
                    </Col>

                    <div className="center-block">
                        <Popconfirm placement="bottom" title={confirmText} onConfirm={() =>
                        {this.onAcceptPayment()}}
                                    okText="Yes" cancelText="No">
                            <Button className="btn-success" disabled={loading}>
                                Accept Payment...
                            </Button>
                        </Popconfirm>
                    </div>

                </>
                }
                <Col span={24}>
                    <p>As a scholarship winner on Atila:</p>
                    <ol>
                        <li>Your application and thank you letter may be shared on your profile. <br /><br />
                            Your application was amazing, which is why you were selected as a winner.
                            By sharing your application you can mention on your resume or LinkedIn
                            that you were a winner of the {scholarship.name} award and link to your application.
                            This could help you with future jobs, schools and other activities you apply to.
                            <br /><br />
                            You would also help other students by showing them what a good application
                            and thank you letter looks like.<br /><br />
                            If you would rather not share or want to edit before sharing your application,
                            your thank you letter or both, that&rsquo;s completely fine as well.
                            Just email us, <a href="mailto:info@atila.ca">info@atila.ca</a> to let us know.<br /><br />
                        </li>
                        <li>We recommend you <Link to="/profile/edit">add a profile picture to your profile.</Link>
                            <br /><br />
                            A picture of yourself humanizes your account and makes it easier for other people
                            with a similar background and story to yours to connect with you,
                            this can also create more future opportunities for you.</li>
                    </ol>
                </Col>
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
                        <h1>{NOT_LOGGED_IN_PAYMENT_ACCEPT_ERROR}</h1>
                    </div>
                </div>
            )
        }

        if (!application) {
            if (loading) {
                return (
                    <div className="container mt-5">
                        <div className="card shadow p-3">
                            <Loading title={loading} />
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="container mt-5">
                        <div className="card shadow p-3">
                            <h1>{UNAUTHORIZED_TO_VIEW_PAGE}</h1>
                        </div>
                    </div>
                )
            }
        }

        if (application.user.user !== userProfile.user || !application.is_winner) {
            return (
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <h1>{UNAUTHORIZED_TO_VIEW_PAGE}</h1>
                    </div>
                </div>
            )
        }

        let currentPaymentAcceptanceStepIndex = this.getCurrentStep();

        let paymentAcceptanceSteps = [
            {
                slug: 'verify_email',
                title: 'Verify Email',
                render: this.verifyEmailStep,
            },
            {
                slug: 'security_question',
                title: 'Security Question',
                render: this.securityQuestionStep,
            },
            {
                slug: 'thank_you_email',
                title: 'Thank You Email',
                render: this.thankYouEmailStep,
            },
            {
                slug: 'accept_payment',
                title: 'Accept Payment',
                render: this.acceptPaymentStep,
            }
        ]

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    {loading &&
                    <Loading title={loading} />
                    }
                    <Steps type="navigation"
                        current={currentPaymentAcceptanceStepIndex}>
                        {paymentAcceptanceSteps.map(step => (
                            <Step key={step.slug} title={step.title} />
                        ))}
                    </Steps>
                    <div>
                        <h1>Accept Your Award for
                            <Link to={`/scholarship/${scholarship.slug}`}> {scholarship.name}</Link>
                        </h1>

                        {paymentAcceptanceSteps[currentPaymentAcceptanceStepIndex].render()}

                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = {
    updateLoggedInUserProfile,
};
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentAccept);

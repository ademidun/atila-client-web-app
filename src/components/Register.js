import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserProfileAPI from "../services/UserProfileAPI";
import Loading from "./Loading";
import './LoginRegister.scss';
import { setLoggedInUserProfile } from "../redux/actions/user";
import { connect } from "react-redux";
import TermsConditions from "./TermsConditions";
import { Alert, Select, Modal, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { forbiddenCharacters, hasForbiddenCharacters } from "../models/Utils";
import ReferredByInput from './ReferredByInput';
import { toTitleCase } from '../services/utils';
import Environment from '../services/Environment';
import { autoGenerateUser } from '../models/UserProfile.class';
import { DemoUserMessage } from '../services/DemoUtils';

export const LOG_OUT_BEFORE_REGISTERING_HELP_TEXT = "A user is already logged in. Log out to create an account";

// see: https://github.com/ademidun/atila-django/issues/183
const problematicEmailProviders = ['@hotmail', '@outlook', '@live', '@yahoo'];

export function EmailSignUpWarning({ warningType = "emailProvider" }) {
    let description = (<>
        We've noticed issues with this email provider blocking Atila emails, we recommend using Gmail if you have one.
        <br />
        A list of email providers that are causing similar issues:{' '}
        {problematicEmailProviders.map(emailProvider => toTitleCase(emailProvider.replace("@", ""))).join(', ')}
    </>);

    if (warningType === "schoolEmail") {
        description = <>
            Users have reported issues with their school emails blocking Atila emails, we recommend using your personal email instead of your school email.
            <br />
            If this is a personal email address, you may ignore this message.
        </>;
    }
    description = <p>
        {description} <br />
        <Link to="/blog/alona/use-your-personal-email-preferably-gmail-not-your-school-email-when-signing-up-for-an-account-on-atila">Learn more</Link>
    </p>;
    return (
        <div>
            <Alert
                message="Warning: Atila emails may not arrive at the provided email address"
                description={description}
                type="warning"
                showIcon
            />

            <br />
            <br />
        </div>
    );
}

export class PasswordShowHide extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPassword: false,
        };
    }

    togglePassword = (event) => {
        event.preventDefault();
        const { showPassword } = this.state;
        this.setState({ showPassword: !showPassword });
    };

    render() {
        const { password, updateForm, placeholder, disabled } = this.props;
        const { showPassword } = this.state;

        return (
            <div className="w-100 mb-3">
                <input placeholder={placeholder}
                    className="col-12 form-control"
                    name="password"
                    value={password}
                    autoComplete="new-password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={updateForm}
                    disabled={disabled}
                />
                {!disabled &&
                    <div
                        onClick={this.togglePassword}
                        className="text-muted font-size-xm cursor-pointer mt-2">
                        {showPassword ? 'Hide ' : 'Show '} {placeholder}
                    </div>
                }
            </div>);
    }
}

PasswordShowHide.defaultProps = {
    placeholder: 'Password',
    disabled: false,
};

PasswordShowHide.propTypes = {
    updateForm: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

const defaultAccountType = "student";
const mentorAccountType = "mentor";
const menteeAccountType = "mentee";
const sponsorAccountType = "sponsor";

const accountTypes = [
    { label: 'Student (Apply for Scholarships)', value: defaultAccountType }, // default
    { label: 'Mentee (Receive Mentorship)', value: menteeAccountType }, // default
    { label: 'Mentor (Provide Mentorship)', value: mentorAccountType }, // default
    { label: 'Sponsor (Create Scholarships)', value: sponsorAccountType },
    { label: 'Reviewer (Review Scholarships)', value: 'reviewer' },
    { label: 'Educator (Help students get scholarships)', value: 'teacher' },
];

function checkValidEmailProviders(email) {
    for (let domainIndex = 0; domainIndex < problematicEmailProviders.length; domainIndex++) {
        if (email.toLowerCase().search(problematicEmailProviders[domainIndex]) !== -1) {
            return false;
        }
    }
    return true;
}

function Register(props) {
    const navigate = useNavigate();
    const [state, setState] = useState(() => {
        const {
            location: { search },
        } = props;
        const params = new URLSearchParams(search);

        let nextLocation = params.get('redirect') || '/scholarship';
        let applyNow = params.get('applyNow') || false;
        let accountType = params.get('type') || defaultAccountType;
        let referredBy = localStorage.getItem('referred_by') || '';
        let mostRecentlyViewedContentName = localStorage.getItem('mostRecentlyViewedContentName') || '';
        let mostRecentlyViewedContentSlug = localStorage.getItem('mostRecentlyViewedContentSlug') || '';

        if (nextLocation === '/') {
            nextLocation = '/scholarship';
        }

        const defaultUser = Environment.name !== "prod" ? autoGenerateUser() : {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
        };

        return {
            userProfile: {
                ...defaultUser,
                referred_by: referredBy,
                referredByChecked: !!referredBy,
                account_type: accountType,
                agreeTermsConditions: false,
                ...props.userProfile,
            },
            nextLocation,
            applyNow,
            mostRecentlyViewedContentName,
            mostRecentlyViewedContentSlug,
            isResponseError: null,
            responseOkMessage: null,
            loadingResponse: null,
            isTermsConditionsModalVisible: false,
            formErrors: {},
        };
    });

    const updateForm = (event) => {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        const userProfile = { ...state.userProfile };

        const { formErrors } = state;

        let value = event.target.value;
        if (event.target.name === 'username') {
            value = value.replace(/\s/g, '');

            if (value.includes('@')) {
                formErrors['username'] = (
                    <p className="text-danger">
                        '@' symbol not allowed in username. <br />
                        Make sure you're not using your email as your username by accident.
                    </p>);

            } else if (hasForbiddenCharacters(value)) {
                formErrors['username'] = (
                    <p className="text-danger">
                        The following characters, <em> {forbiddenCharacters.toString()}</em> are not allowed in your username.
                    </p>);

            } else {
                delete formErrors['username'];
            }
            setState({ ...state, formErrors });
        }

        if (event.target.type === 'email') {
            value = value.replace(/\s/g, '');

            if (!checkValidEmailProviders(value)) {
                formErrors['email'] = (
                    <EmailSignUpWarning warningType="emailProvider" />
                );

            } else if (value.endsWith('.ca')) {
                formErrors['email'] = (
                    <EmailSignUpWarning warningType="schoolEmail" />
                );

            } else {
                delete formErrors['email'];
            }
            setState({ ...state, formErrors });
        }

        if (event.target.type === 'checkbox') {
            value = event.target.checked;
        }
        userProfile[event.target.name] = value;

        setState({ ...state, userProfile });
    };

    const showTermsConditionsModal = (event, showModal) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
        setState({ ...state, isTermsConditionsModalVisible: showModal });
    };

    const submitForm = (event) => {
        event.preventDefault();
        const { setLoggedInUserProfile, disableRedirect, onRegistrationFinished } = props;
        const { userProfile } = state;
        let { nextLocation } = state;
        const { email, username, password, account_type, referred_by, referredByChecked } = userProfile;

        setState((prevState) => ({ ...prevState, loadingResponse: true, isResponseError: null }));

        let userProfileSendData = {
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email, username, account_type,
        };

        if (referredByChecked) {
            userProfileSendData = { ...userProfileSendData, referred_by };
        }

        if (nextLocation === '/scholarship') {
            switch (account_type) {
                case sponsorAccountType:
                    nextLocation = "/scholarship/add";
                    break;
                case mentorAccountType:
                    nextLocation = "/profile/edit";
                    break;
                case menteeAccountType:
                    nextLocation = "/mentorship";
                    break;
                default:
                    break;
            }
        }

        let contactMessage = (<React.Fragment>
            Error logging in.{' '}
            <Link to="/contact">
                Contact us</Link> if this continues
        </React.Fragment>);

        UserProfileAPI
            .createUser({
                userProfile: userProfileSendData,
                user: { email, username, password },
                locationData: null
            })
            .then(res => {
                const { data: { token, user_profile, id } } = res;
                UserProfileAPI.authenticateRequests(token, id);
                setLoggedInUserProfile(user_profile);
                let responseOkMessage = "Registration successful 🙂!";
                if (!disableRedirect) {
                    responseOkMessage += " Redirecting...";
                }
                setState((prevState) => ({ ...prevState, responseOkMessage }));
                if (!disableRedirect) {
                    navigate(nextLocation);
                }
                onRegistrationFinished(user_profile);
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    let isResponseError = err.response.data;
                    let showContactMessage = false;

                    if (typeof isResponseError.message === "string" &&
                        'contact us' in isResponseError.message.toLowerCase()) {
                        showContactMessage = true;
                    }

                    isResponseError = (
                        <p className="text-danger">
                            {showContactMessage && contactMessage}
                            {isResponseError.message || isResponseError.error}
                        </p>);
                    setState((prevState) => ({ ...prevState, isResponseError }));

                } else {
                    setState((prevState) => ({ ...prevState, responseError: contactMessage }));
                }
            })
            .finally(() => {
                setState((prevState) => ({ ...prevState, loadingResponse: false }));
            });
    };

    const selectReferredByUserProfile = (referredByUserProfile) => {
        const newUserProfile = { ...state.userProfile, referred_by: referredByUserProfile.username };
        setState({ ...state, userProfile: newUserProfile });
    };

    const { userProfile, isResponseError, responseOkMessage,
        loadingResponse, isTermsConditionsModalVisible,
        formErrors, applyNow,
        mostRecentlyViewedContentName, nextLocation, mostRecentlyViewedContentSlug } = state;
    const { first_name, last_name, username, email, password, referred_by,
        agreeTermsConditions, account_type, referredByChecked } = userProfile;

    const { location: { search }, loggedInUserProfile, className } = props;

    if (loggedInUserProfile) {
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>
                        {LOG_OUT_BEFORE_REGISTERING_HELP_TEXT}
                    </h1>
                </div>
            </div>
        );
    }

    let formErrorsContent = Object.keys(formErrors).map((errorType) => (
        <div key={errorType}>
            {formErrors[errorType]}
        </div>
    ));

    let loginCTA = (
        <Link to={`/login${search}`} className="text-center col-12 mb-3">
            Already have an account? Login
        </Link>
    );

    let redirectInstructions = null;

    if (mostRecentlyViewedContentName && nextLocation
        && mostRecentlyViewedContentSlug && nextLocation.includes(mostRecentlyViewedContentSlug)) {
        redirectInstructions = (<h3 className="text-center text-muted">
            You need an account to {applyNow ? "apply for: " : "see: "}
            <Link to={nextLocation}>{mostRecentlyViewedContentName}</Link>
            {applyNow ? " and track your application status." : null}
            <br />
            {loginCTA}
        </h3>);
    }

    return (
        <div className={className}>
            <div className="card shadow p-3 text-left">
                <div>
                    <h1>Register</h1>
                    <DemoUserMessage />
                    {redirectInstructions}
                    <div className="row p-3 form-group">
                        {first_name &&
                            <label>
                                First Name
                            </label>
                        }
                        <input placeholder="First Name"
                            className="col-12 mb-3 form-control"
                            name="first_name"
                            value={first_name}
                            onChange={updateForm}
                            required
                        />
                        {last_name &&
                            <label>
                                Last Name
                            </label>
                        }
                        <input placeholder="Last Name"
                            name="last_name"
                            className="col-12 mb-3 form-control"
                            value={last_name}
                            onChange={updateForm}
                            required
                        />
                        {email &&
                            <label>
                                Email
                            </label>
                        }
                        <input placeholder="Email"
                            className="col-12 mb-3 form-control"
                            type="email"
                            name="email"
                            value={email}
                            autoComplete="email"
                            onChange={updateForm}
                            required
                        />
                        {username &&
                            <label>
                                Username
                            </label>
                        }
                        <input placeholder="Username"
                            className={"col-12 mb-3 form-control" +
                                `${formErrors['username'] ? ' input-error' : ''}`}
                            name="username"
                            type="username"
                            value={username}
                            autoComplete="username"
                            onChange={updateForm}
                            required
                        />
                        <PasswordShowHide password={password} updateForm={updateForm} />
                        {Environment.name === "prod" && username && password && username === password &&
                            <div className="w-100 mb-3">
                                <Alert
                                    message="Warning: Username and password must be different"
                                    type="warning"
                                    showIcon
                                />
                            </div>
                        }

                        <label className='mr-3 mb-3'>Did someone refer you to Atila?</label>
                        <input className={'mb-3'}
                            type="checkbox"
                            name="referredByChecked"
                            checked={referredByChecked}
                            onChange={updateForm}
                        />
                        {referredByChecked &&
                            <div className="w-100 my-1">
                                <ReferredByInput username={referred_by} onSelect={selectReferredByUserProfile} />
                            </div>
                        }
                        <div className="w-100 my-1">
                            <label>
                                I am a(n):
                            </label>
                            <br />
                            <Select
                                value={account_type}
                                className="col-md-6 col-sm-12 pl-0"
                                options={accountTypes}
                                onChange={account_type => setState({ ...state, userProfile: { ...state.userProfile, account_type } })}
                            />
                        </div>

                        <div className="my-3">
                            <Modal
                                title="Terms and Conditions"
                                visible={isTermsConditionsModalVisible}
                                onOk={(event) => showTermsConditionsModal(event, false)}
                                onCancel={(event) => showTermsConditionsModal(event, false)}
                            >
                                <TermsConditions />
                            </Modal>
                            <label htmlFor='agreeTermsConditions' className="mr-3">
                                Agree to the{' '}
                                <button className="btn-text btn-link p-0"
                                    onClick={(event) => showTermsConditionsModal(event, true)}>
                                    terms and conditions
                                </button>
                            </label>
                            <input placeholder="Agree to the terms and conditions?"
                                type="checkbox"
                                name='agreeTermsConditions'
                                checked={agreeTermsConditions}
                                onChange={updateForm}
                            />
                        </div>
                        <hr />
                        <div className="w-100">
                            {responseOkMessage &&
                                <p className="text-success">
                                    {responseOkMessage}
                                </p>
                            }
                            {
                                Object.keys(formErrors).length > 0 &&
                                formErrorsContent
                            }

                            {isResponseError &&
                                isResponseError
                            }

                        </div>
                        {loadingResponse &&
                            <Loading title="Loading Response..." className="center-block my-3" />}
                        <Button className="col-12 mb-3 button-cta"
                            type="primary"
                            onClick={submitForm}
                            disabled={loadingResponse || !agreeTermsConditions ||
                                (Object.keys(formErrors).length > 0 && !formErrors.email)}>
                            Register
                        </Button>

                        {loginCTA}

                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

const mapDispatchToProps = {
    setLoggedInUserProfile
};

Register.defaultProps = {
    disableRedirect: false,
    userProfile: {},
    onRegistrationFinished: () => { },
    className: "container mt-5"
};

Register.propTypes = {
    setLoggedInUserProfile: PropTypes.func.isRequired,
    onRegistrationFinished: PropTypes.func,
    disableRedirect: PropTypes.bool,
    className: PropTypes.string,
    userProfile: PropTypes.shape({}),
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

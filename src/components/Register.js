import React from 'react';
import PropTypes from 'prop-types';
import UserProfileAPI from "../services/UserProfileAPI";
import Loading from "./Loading";
import './LoginRegister.scss';
import {setLoggedInUserProfile} from "../redux/actions/user";
import {connect} from "react-redux";
import TermsConditions from "./TermsConditions";
import { Alert, Select, Modal, Button } from "antd";
import {Link} from "react-router-dom";
import {forbiddenCharacters, hasForbiddenCharacters} from "../models/Utils";
import ReferredByInput from './ReferredByInput';
import { toTitleCase } from '../services/utils';


export const LOG_OUT_BEFORE_REGISTERING_HELP_TEXT = "A user is already logged in. Log out to create an account";

// see: https://github.com/ademidun/atila-django/issues/183
const problematicEmailProviders = ['@hotmail', '@outlook', '@live', '@yahoo']

export function EmailSignUpWarning({warningType="emailProvider"}){

    let description = (<>
        We've noticed issues with this email provider blocking Atila emails, we recommend using Gmail if you have one.
        <br/>
        A list of email providers that are causing similar issues:{' '} 
        {problematicEmailProviders.map(emailProvider => toTitleCase(emailProvider.replace("@", ""))).join(', ')}
    </>);

    if (warningType === "schoolEmail") {
        description = <>
         Users have reported issues with their school emails blocking Atila emails, we recommend using your personal email instead of your school email.
        <br/>
         If this is a personal email address, you may ignore this message.
        </>
    }
    description = <p>
        {description} <br/>
        <Link to="/blog/alona/use-your-personal-email-preferably-gmail-not-your-school-email-when-signing-up-for-an-account-on-atila">Learn more</Link>
    </p>
    return (
        <div>
            <Alert
                message = "Warning: Atila emails may not arrive at the provided email address"
                description={description}
                type="warning"
                showIcon
            />
            
            <br/>
            <br/>
        </div>
    )
}

export class PasswordShowHide extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPassword: false,
        }
    }

    togglePassword = (event) => {
        event.preventDefault();
        const { showPassword } = this.state;
        this.setState({showPassword: !showPassword})
    };


    render (){

        const { password, updateForm , placeholder, disabled} = this.props;
        const { showPassword } = this.state;

        return (
            <div className="w-100 mb-3">
                <input placeholder={placeholder}
                       className="col-12 form-control"
                       name="password"
                       value={password}
                       autoComplete="new-password"
                       type={showPassword? 'text': 'password'}
                       onChange={updateForm}
                       disabled={disabled}
                />
                {!disabled &&
                <span
                    onClick={this.togglePassword}
                    className="text-muted font-size-xm cursor-pointer pl-2">
                                    {showPassword ? 'Hide ' : 'Show '} {placeholder}
                                </span>
                }
            </div>)
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

const accountTypes = [
    { label: 'Student (Apply for Scholarships)', value: 'student' }, // default
    { label: 'Sponsor (Create Scholarships)', value: 'sponsor' },
    { label: 'Reviewer (Review Scholarships)', value: 'reviewer' },
    { label: 'Educator (Help my students get scholarships)', value: 'teacher' },
];


const defaultAccountType = accountTypes[0].value
const sponsorAccountType = accountTypes[1].value

function checkValidEmailProviders(email) {
	for (let domainIndex = 0; domainIndex < problematicEmailProviders.length; domainIndex++) {

		if (email.toLowerCase().search(problematicEmailProviders[domainIndex]) !== -1) {
			return false;
		}
	}
	return true;
}

class Register extends React.Component {

    constructor(props){
        super(props);

        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);

        let nextLocation = params.get('redirect') || '/scholarship';
        let applyNow = params.get('applyNow') || false;
        let accountType = params.get('type') || defaultAccountType;
        let referredBy = localStorage.getItem('referred_by') || '';
        let mostRecentlyViewedContentName = localStorage.getItem('mostRecentlyViewedContentName') || '';
        let mostRecentlyViewedContentSlug = localStorage.getItem('mostRecentlyViewedContentSlug') || '';

        if (nextLocation==='/') {
            nextLocation = '/scholarship';
        }
        this.state = {
            userProfile: {
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
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
    }

    updateForm = (event) => {

        if (event.stopPropagation) {
            event.stopPropagation();
        }
        const userProfile = {...this.state.userProfile};

        const { formErrors } = this.state;

        let value = event.target.value;
        if (event.target.name === 'username') {
            value = value.replace(/\s/g, '');

            if (value.includes('@')) {
                formErrors['username'] = (
                    <p className="text-danger">
                        '@' symbol not allowed in username. <br/>
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
            this.setState({ formErrors });
        }
        
        
        if (event.target.type === 'email') {
            value = value.replace(/\s/g, '');

            if (!checkValidEmailProviders(value)) {
               
                formErrors['email'] = (
                    <EmailSignUpWarning warningType="emailProvider"/>
                );

            } else if (value.endsWith('.ca')) {
                // assumes that a user registering with an email ending with '.ca' is a school email (not always true, but a pretty accurate assumption based on user emails in our database)
                formErrors['email'] = (
                    <EmailSignUpWarning warningType="schoolEmail"/>
                );
                
            
            }  else {
                delete formErrors['email'];
            }
            this.setState({ formErrors });   
        }

        if (event.target.type==='checkbox'){
            value = event.target.checked
        }
        userProfile[event.target.name] = value;

        this.setState({ userProfile });
    };

    showTermsConditionsModal = (event, showModal) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
        this.setState({
            isTermsConditionsModalVisible: showModal,
        });
    };

    submitForm = (event) => {
        event.preventDefault();
        const { setLoggedInUserProfile, disableRedirect, onRegistrationFinished } = this.props;
        const { userProfile } = this.state;
        let { nextLocation } = this.state;
        const { email, username, password, account_type, referred_by, referredByChecked } = userProfile;

        this.setState({ loadingResponse: true});
        this.setState({ isResponseError: null});

        let userProfileSendData = {
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email, username, account_type,
        };

        if (referredByChecked) {
            userProfileSendData = { ...userProfileSendData, referred_by}
        }

        // If this is a sponsor account type, redirect to the add a scholarship page
        if (account_type === sponsorAccountType && nextLocation === '/scholarship') {
            nextLocation = "/scholarship/add"
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

                const { data: { token, user_profile, id }} = res;
                UserProfileAPI.authenticateRequests(token, id);
                setLoggedInUserProfile(user_profile);
                let responseOkMessage = "Registration successful 🙂!";
                if(!disableRedirect) {
                    responseOkMessage += " Redirecting..."
                }
                this.setState({ responseOkMessage });
                if(!disableRedirect) {
                    this.props.history.push(nextLocation);
                }
                onRegistrationFinished(user_profile)
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
                    this.setState({ isResponseError });

                } else {
                    this.setState({ responseError: contactMessage });
                }
            })
            .finally(() => {
                this.setState({ loadingResponse: false});
            })
    };

    selectReferredByUserProfile = (referredByUserProfile) => {
        const newUserProfile = { ...this.state.userProfile, referred_by: referredByUserProfile.username }
        this.setState({userProfile: newUserProfile});
    };

    render () {

        const { userProfile, isResponseError, responseOkMessage,
            loadingResponse, isTermsConditionsModalVisible,
             formErrors, applyNow,
              mostRecentlyViewedContentName, nextLocation, mostRecentlyViewedContentSlug } = this.state;
        const { first_name, last_name, username, email, password, referred_by,
            agreeTermsConditions, account_type, referredByChecked } = userProfile;
        
        const { location: { search }, loggedInUserProfile } = this.props;

        if (loggedInUserProfile) {
            return (
                <div className="container mt-5">
                <div className="card shadow p-3">
                <h1>
                    {LOG_OUT_BEFORE_REGISTERING_HELP_TEXT}
                </h1>
                </div>
            </div>
            )
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
        )

        let redirectInstructions = null;

        if (mostRecentlyViewedContentName && nextLocation 
            && mostRecentlyViewedContentSlug && nextLocation.includes(mostRecentlyViewedContentSlug)) {
            redirectInstructions = (<h3 className="text-center text-muted">
                You need an account to {applyNow? "apply for: " : "see: "}
                <Link to={nextLocation}>{mostRecentlyViewedContentName}</Link>
                {applyNow? " and track your application status." : null}
                <br/>
                {loginCTA}
            </h3>)
        }

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <div>
                        <h1>Register</h1>
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
                                   onChange={this.updateForm}
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
                                   onChange={this.updateForm}
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
                                   onChange={this.updateForm}
                                   required
                            />
                            {username &&
                                <label>
                                    Username
                                </label>
                            }
                            <input placeholder="Username"
                                   className={"col-12 mb-3 form-control" +
                                   `${formErrors['username']? ' input-error': ''}`}
                                   name="username"
                                   type="username"
                                   value={username}
                                   autoComplete="username"
                                   onChange={this.updateForm}
                                   required
                            />
                            <PasswordShowHide password={password} updateForm={this.updateForm} />

                            <label className='mr-3 mb-3'>Did someone refer you to Atila?</label>
                            <input className={'mt-1'}
                                   type="checkbox"
                                   name="referredByChecked"
                                   checked={referredByChecked}
                                   onChange={this.updateForm}
                            />
                            {referredByChecked &&
                            <div className="w-100 my-1">
                                <ReferredByInput username={referred_by} onSelect={this.selectReferredByUserProfile} />
                            </div>
                            }
                            <div className="w-100 my-1">
                                <label>
                                    I am a(n):
                                </label>
                                <br/>
                                <Select
                                    value={account_type}
                                    style={{ width: 350 }} 
                                    options={accountTypes}
                                    onChange={account_type => this.setState({userProfile:
                                                {...this.state.userProfile, account_type}})}
                                />
                            </div>

                            <div className="mb-3">
                                <Modal
                                    title="Terms and Conditions"
                                    visible={isTermsConditionsModalVisible}
                                    onOk={(event)=>this.showTermsConditionsModal(event, false)}
                                    onCancel={(event)=>this.showTermsConditionsModal(event, false)}
                                >
                                    <TermsConditions />
                                </Modal>
                                <label htmlFor='agreeTermsConditions' className="mr-3">
                                    Agree to the
                                    <button className="btn-text btn-link"
                                                         onClick={(event)=>this.showTermsConditionsModal(event, true)}>
                                    terms and conditions
                                    </button>?
                                </label>
                                <input placeholder="Agree to the terms and conditions?"
                                       type="checkbox"
                                       name='agreeTermsConditions'
                                       checked={agreeTermsConditions}
                                       onChange={this.updateForm}
                                />
                            </div>
                            <hr/>
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
                            <Loading title="Loading Response..." className="center-block my-3"/>}
                            <Button className="col-12 mb-3 button-cta"
                                    type="primary"
                                    onClick={this.submitForm}
                                    disabled={loadingResponse || !agreeTermsConditions ||
                                    (Object.keys(formErrors).length > 0 && !formErrors.email)}>
                                Register
                            </Button>

                            {loginCTA}

                        </div>
                    </div>
                </div>
            </div>
        )
    }
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
    onRegistrationFinished: () => {},
};

Register.propTypes = {
    setLoggedInUserProfile: PropTypes.func.isRequired,
    onRegistrationFinished: PropTypes.func,
    disableRedirect: PropTypes.bool,
    userProfile:PropTypes.shape({}),
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

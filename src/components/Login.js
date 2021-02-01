import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import UserProfileAPI from "../services/UserProfileAPI";
import {PasswordShowHide} from "./Register";
import {setLoggedInUserProfile} from "../redux/actions/user";
import ResponseDisplay from "./ResponseDisplay";
import HelmetSeo, {defaultSeoContent} from "./HelmetSeo";
import { Button } from "antd";

class Login extends React.Component {

    _isMounted = false;

    constructor(props){
        super(props);


        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);

        let nextLocation = params.get('redirect') || '/scholarship';
        let applyNow = params.get('applyNow') || false;
        let mostRecentlyViewedContentName = localStorage.getItem('mostRecentlyViewedContentName') || '';
        let mostRecentlyViewedContentSlug = localStorage.getItem('mostRecentlyViewedContentSlug') || '';

        if (nextLocation==='/' || nextLocation.includes('/register')) {
            nextLocation = '/scholarship';
            window.history.replaceState(null, 'Login', `login/?redirect=${nextLocation}`)
        }

        this.state = {
            username: '',
            password: '',
            nextLocation,
            applyNow,
            mostRecentlyViewedContentName,
            mostRecentlyViewedContentSlug,
            responseError: null,
            isLoadingResponse: null,
            responseOkMessage: null,
            forgotPassword: false,
            resetPasswordResponse: '',
        };
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value})
    };

    submitForm = (event) => {
        event.preventDefault();
        const { username, password, nextLocation } = this.state;
        const { setLoggedInUserProfile } = this.props;
        this.setState({ isLoadingResponse: true});
        this.setState({ responseError: null});
        UserProfileAPI
            .login({ username, password })
            .then(res => {
                this.setState({ responseOkMessage: 'Login successful 🙂! Redirecting...'});
                setLoggedInUserProfile(res.data.user_profile);
                UserProfileAPI.authenticateRequests(res.data.token, res.data.id);

                this.props.history.push(nextLocation);
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({ responseError: err.response.data});
                } else {
                    const responseError = (<React.Fragment>
                        Error logging in.{' '}
                        <Link to="/contact">
                            Contact us</Link> if this continues
                    </React.Fragment>);
                    this.setState({ responseError });
                }
            })
            .finally(res => {
                if (this._isMounted) {
                    this.setState({ isLoadingResponse: false});
                }
            })
    };

    submitResetPasswordForm = (event) => {
        event.preventDefault();
        const { username } = this.state;
        this.setState({ isLoadingResponse: true});
        this.setState({ responseError: null});
        UserProfileAPI
            .resetPassword(username)
            .then(res => {
                this.setState({ responseOkMessage: res.data.message });

            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({ responseError: err.response.data});
                }
            })
            .finally(res => {
                if (this._isMounted) {
                    this.setState({ isLoadingResponse: false});
                }
            })
    };

    render () {
        const { username, password,
            responseError, isLoadingResponse,
            responseOkMessage, forgotPassword, nextLocation,
            mostRecentlyViewedContentName, mostRecentlyViewedContentSlug, applyNow } = this.state;

        const seoContent = {
            ...defaultSeoContent,
            title: 'Login'
        };

        let redirectInstructions = null;

        if (mostRecentlyViewedContentName && nextLocation 
            && mostRecentlyViewedContentSlug && nextLocation.includes(mostRecentlyViewedContentSlug)) {
            redirectInstructions = (<h3 className="text-center text-muted">
                Login to {applyNow? "start or continue application for: " : "see: "}
                <Link to={nextLocation}>{mostRecentlyViewedContentName}</Link>
            </h3>)
        }
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <div>
                        <HelmetSeo content={seoContent}/>
                        <h1>Login</h1>
                        {redirectInstructions}
                        <div className="row p-3">
                            <input placeholder="Username or Email"
                                   className="col-12 mb-3 form-control"
                                   name="username"
                                   value={username}
                                   autoComplete="username"
                                   onChange={this.updateForm}
                            />
                            <PasswordShowHide password={password} updateForm={this.updateForm} />
                            <div className="w-100">
                                <Button className="col-sm-12 col-md-5 float-left mb-1 button-cta"
                                        onClick={this.submitForm}
                                        type="primary"
                                        disabled={isLoadingResponse}>
                                    Login
                                </Button>
                                <Button className="col-sm-12 col-md-5 float-right button-cta">
                                    <Link to={`/register?redirect=${nextLocation}`}>
                                        Register
                                    </Link>
                                </Button>
                            </div>
                            <Button className="max-width-fit-content button-cta"
                                    type="link"
                                    onClick={event=> {
                                        event.preventDefault();
                                        this.setState({forgotPassword: true});
                                    }}>
                                Forgot password?
                            </Button>
                        </div>
                        {forgotPassword &&
                        <div className="row p-3">
                            <label>Enter username or email to receive password reset token</label>
                            <input placeholder="Username or Email"
                                   className="col-12 mb-3 form-control"
                                   name="username"
                                   value={username}
                                   autoComplete="username"
                                   onChange={this.updateForm}
                            />
                            <Button className="col-sm-12 col-md-5 float-left mb-3 button-cta"
                                    type="primary"
                                    disabled={isLoadingResponse}
                                    onClick={this.submitResetPasswordForm}>
                                Send Email
                            </Button>
                            <label className="w-100">
                                Already have a reset token?
                                <Link to="/verify?verification_type=reset_password"> Reset password </Link>
                            </label>
                        </div>

                        }

                        <ResponseDisplay isLoadingResponse={isLoadingResponse}
                                         responseError={responseError}
                                         responseOkMessage={responseOkMessage} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    setLoggedInUserProfile
};

Login.propTypes = {
    setLoggedInUserProfile: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);

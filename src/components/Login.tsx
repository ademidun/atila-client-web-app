import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import UserProfileAPI from "../services/UserProfileAPI";
import { PasswordShowHide } from "./Register";
import { setLoggedInUserProfile } from "../redux/actions/user";
import ResponseDisplay from "./ResponseDisplay";
import HelmetSeo, { defaultSeoContent } from "./HelmetSeo";
import { Button } from "antd";

interface LoginProps {
    setLoggedInUserProfile: (userProfile: any) => void;
}

function Login({ setLoggedInUserProfile }: LoginProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    let nextLocation = params.get('redirect') || '/scholarship';
    const applyNow = params.get('applyNow') || false;
    const mostRecentlyViewedContentName = localStorage.getItem('mostRecentlyViewedContentName') || '';
    const mostRecentlyViewedContentSlug = localStorage.getItem('mostRecentlyViewedContentSlug') || '';

    if (nextLocation === '/' || nextLocation.includes('/register')) {
        nextLocation = '/scholarship';
        window.history.replaceState(null, 'Login', `login/?redirect=${nextLocation}`);
    }

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [responseError, setResponseError] = useState<React.ReactNode | null>(null);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [responseOkMessage, setResponseOkMessage] = useState<string | null>(null);
    const [forgotPassword, setForgotPassword] = useState(false);

    const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        const { username, password } = formData;
        
        setIsLoadingResponse(true);
        setResponseError(null);
        
        try {
            const res = await UserProfileAPI.login({ username, password });
            setResponseOkMessage('Login successful 🙂! Redirecting...');
            setLoggedInUserProfile(res.data.user_profile);
            UserProfileAPI.authenticateRequests(res.data.token, res.data.id);
            navigate(nextLocation);
        } catch (err: any) {
            if (err.response && err.response.data) {
                setResponseError(err.response.data);
            } else {
                setResponseError(
                    <React.Fragment>
                        Error logging in.{' '}
                        <Link to="/contact">Contact us</Link> if this continues
                    </React.Fragment>
                );
            }
        } finally {
            setIsLoadingResponse(false);
        }
    };

    const submitResetPasswordForm = async (event: React.FormEvent) => {
        event.preventDefault();
        const { username } = formData;
        
        setIsLoadingResponse(true);
        setResponseError(null);
        
        try {
            const res = await UserProfileAPI.resetPassword(username);
            setResponseOkMessage(res.data.message);
        } catch (err: any) {
            if (err.response && err.response.data) {
                setResponseError(err.response.data);
            }
        } finally {
            setIsLoadingResponse(false);
        }
    };

    const seoContent = {
        ...defaultSeoContent,
        title: 'Login'
    };

    let redirectInstructions = null;

    if (mostRecentlyViewedContentName && nextLocation 
        && mostRecentlyViewedContentSlug && nextLocation.includes(mostRecentlyViewedContentSlug)) {
        redirectInstructions = (
            <h3 className="text-center text-muted">
                Login to {applyNow ? "start or continue application for: " : "see: "}
                <Link to={nextLocation}>{mostRecentlyViewedContentName}</Link>
            </h3>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow p-3">
                <div>
                    <HelmetSeo content={seoContent}/>
                    <h1>Login</h1>
                    {redirectInstructions}
                    <div className="row p-3">
                        <input 
                            placeholder="Username or Email"
                            className="col-12 mb-3 form-control"
                            name="username"
                            value={formData.username}
                            autoComplete="username"
                            onChange={updateForm}
                        />
                        <PasswordShowHide 
                            password={formData.password} 
                            updateForm={updateForm} 
                        />
                        <div className="w-100">
                            <Button 
                                className="col-sm-12 col-md-5 float-left mb-1 button-cta"
                                onClick={submitForm}
                                type="primary"
                                disabled={isLoadingResponse}
                            >
                                Login
                            </Button>
                            <Button className="col-sm-12 col-md-5 float-right button-cta">
                                <Link to={`/register?redirect=${nextLocation}`}>
                                    Register
                                </Link>
                            </Button>
                        </div>
                        <Button 
                            className="max-width-fit-content button-cta"
                            type="link"
                            onClick={() => setForgotPassword(true)}
                        >
                            Forgot password?
                        </Button>
                    </div>
                    {forgotPassword && (
                        <div className="row p-3">
                            <label>Enter username or email to receive password reset token</label>
                            <input 
                                placeholder="Username or Email"
                                className="col-12 mb-3 form-control"
                                name="username"
                                value={formData.username}
                                autoComplete="username"
                                onChange={updateForm}
                            />
                            <Button 
                                className="col-sm-12 col-md-5 float-left mb-3 button-cta"
                                type="primary"
                                disabled={isLoadingResponse}
                                onClick={submitResetPasswordForm}
                            >
                                Send Email
                            </Button>
                            <label className="w-100">
                                Already have a reset token?
                                <Link to="/verify?verification_type=reset_password"> Reset password </Link>
                            </label>
                        </div>
                    )}

                    <ResponseDisplay 
                        isLoadingResponse={isLoadingResponse}
                        responseError={responseError}
                        responseOkMessage={responseOkMessage} 
                        loadingTitle="Logging in..."
                    />
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    setLoggedInUserProfile: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    setLoggedInUserProfile
};

export default connect(null, mapDispatchToProps)(Login);

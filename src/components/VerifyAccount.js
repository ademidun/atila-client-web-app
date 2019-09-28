import React from 'react';

import {PasswordShowHide} from "./Register";
import UserProfileAPI from "../services/UserProfileAPI";
import ResponseDisplay from "./ResponseDisplay";

class VerifyAccount extends React.Component {

    constructor(props){
        super(props);

        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);

        const username = params.get('username') || '';
        const token = params.get('token') || '';
        const verification_type = params.get('verification_type') || '';

        this.state = {
            username,
            token,
            verification_type,
            password: '',
            isLoadingResponse: null,
            responseOkMessage: null,
            responseError: null,
        };
    }

    componentDidMount() {
        const { username, token } = this.state;
        if (username && token) {
            this.verifyAccount(true);
        }
    }

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value})
    };

    submitVerifyForm = (event) => {
        event.preventDefault();
        this.verifyAccount();
    };

    verifyAccount = (verifyAccountOnPageLoad=false) => {

        const { username, token, password, verification_type } = this.state;

        let APIPromise = null;

        this.setState({ isLoadingResponse: true});
        this.setState({ responseError: null});

        if (!verifyAccountOnPageLoad && verification_type==='reset_password') {
            APIPromise = UserProfileAPI.verifyResetPassword(username, token, password)
        } else {
            APIPromise  = UserProfileAPI.verifyToken(username, token)
        }
        APIPromise
            .then(res => {
                console.log({res});
                if (!verifyAccountOnPageLoad && verification_type==='reset_password') {
                    this.setState({ responseOkMessage: 'Password reset successful 🙂!\n' +
                            'Log in again with new password'});
                } else {
                    this.setState({ responseOkMessage: 'Verification successful 🙂!'});
                }
            })
            .catch(err => {
                console.log({err});
                if (err.response && err.response.data) {
                    this.setState({ responseError: err.response.data});
                }
            })
            .finally(res => {
                this.setState({ isLoadingResponse: false});
            });
    };

    render () {
        const { username, token, password,
            isLoadingResponse, verification_type,
            responseOkMessage, responseError} = this.state;
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <div>
                        <h1>Verify Your Account</h1>
                        <form className="row p-3" onSubmit={this.submitVerifyForm}>
                            <input placeholder="Username or Email"
                                   className="col-12 mb-3 form-control"
                                   name="username"
                                   value={username}
                                   autoComplete="username"
                                   onChange={this.updateForm}
                            />
                            <input placeholder="token"
                                   className="col-12 mb-3 form-control"
                                   name="token"
                                   value={token}
                                   autoComplete="token"
                                   onChange={this.updateForm}
                            />
                            {
                                verification_type === 'reset_password' &&
                                <PasswordShowHide password={password}
                                                  updateForm={this.updateForm}
                                                  placeholder="Enter a new password" />
                            }
                            <div className="w-100">
                                <button className="btn btn-primary col-sm-12 col-md-5 float-left mb-1"
                                        type="submit"
                                        disabled={isLoadingResponse}>
                                    Submit
                                </button>
                                { verification_type !== 'reset_password' &&
                                <button className="btn btn-link max-width-fit-content"
                                        onClick={event=> {
                                            event.preventDefault();
                                            this.setState({verification_type: 'reset_password'});
                                        }}>
                                    Reset password?
                                </button>
                                }
                            </div>
                        </form>
                        <ResponseDisplay isLoadingResponse={isLoadingResponse}
                                         responseError={responseError}
                                         responseOkMessage={responseOkMessage} />
                    </div>
                </div>
            </div>
        )
    }
}

export default VerifyAccount;

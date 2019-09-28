import React from 'react';
import PropTypes from 'prop-types';
import UserProfileAPI from "../services/UserProfileAPI";
import Loading from "./Loading";
import './LoginRegister.scss';

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

        const { password, updateForm , placeholder} = this.props;
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
                />
                <span
                    onClick={this.togglePassword}
                    className="text-muted font-size-xm cursor-pointer pl-2">
                                    {showPassword ? 'hide ' : 'show '} password
                                </span>
            </div>)
    }
}

PasswordShowHide.defaultProps = {
    placeholder: 'Password'
};

PasswordShowHide.propTypes = {
    updateForm: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
};

class Register extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userProfile: {
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
            },
            isResponseError: null,
            isResponseOk: null,
            loadingResponse: null,
        };
    }

    updateForm = (event) => {
        event.preventDefault();
        const userProfile = {...this.state.userProfile};
        userProfile[event.target.name] = event.target.value;
        this.setState({ userProfile });
    };

    submitForm = (event) => {
        event.preventDefault();
        const { userProfile } = this.state;
        const { email, username, password } = userProfile;

        this.setState({ loadingResponse: true});
        this.setState({ isResponseError: null});

        const userProfileSendData = {
            first_name: userProfile.firstName,
            last_name: userProfile.firstName,
            email, username,
        };

        UserProfileAPI
            .createUser({
                userProfile: userProfileSendData,
                user: { email, username, password },
                locationData: null
            })
            .then(res => {
                this.setState({ isResponseOk: true});
                UserProfileAPI.authenticateRequests(res.data.token, res.data.id);
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({ isResponseError: err.response.data});
                }
            })
            .finally(res => {
                this.setState({ loadingResponse: false});
            })
    };

    render () {

        const { userProfile, isResponseError, isResponseOk, loadingResponse } = this.state;
        const { firstName, lastName, username, email, password } = userProfile;
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <div>
                        <h1>Register</h1>
                        <form className="row p-3 form-group" onSubmit={this.submitForm}>
                            <input placeholder="First name"
                                   className="col-12 mb-3 form-control"
                                   name="firstName"
                                   value={firstName}
                                   onChange={this.updateForm}
                            />
                            <input placeholder="Last Name"
                                   name="lastName"
                                   type="lastName"
                                   className="col-12 mb-3 form-control"
                                   value={lastName}
                                   onChange={this.updateForm}
                            />
                            <input placeholder="Email"
                                   className="col-12 mb-3 form-control"
                                   type="email"
                                   name="email"
                                   value={email}
                                   autoComplete="email"
                                   onChange={this.updateForm}
                            />
                            <input placeholder="Username"
                                   className="col-12 mb-3 form-control"
                                   name="username"
                                   value={username}
                                   autoComplete="username"
                                   onChange={this.updateForm}
                            />
                            <PasswordShowHide password={password} updateForm={this.updateForm} />
                            {isResponseOk &&
                            <p className="text-success">
                                Registration successful!
                                <span role="img" aria-label="happy face emoji">🙂</span>
                            </p>
                            }
                            {isResponseError &&
                            <p className="text-danger">
                                {isResponseError.message || isResponseError.error}
                            </p>
                            }
                            {loadingResponse &&
                            <Loading title="Loading Response..." className="center-block my-3"/>}
                            <button className="btn btn-primary col-12 mb-3"
                                    type="submit"
                                    disabled={loadingResponse}>
                                Register
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;

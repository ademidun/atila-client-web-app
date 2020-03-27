import React from 'react';
import PropTypes from 'prop-types';
import UserProfileAPI from "../services/UserProfileAPI";
import Loading from "./Loading";
import './LoginRegister.scss';
import {setLoggedInUserProfile} from "../redux/actions/user";
import {connect} from "react-redux";
import TermsConditions from "./TermsConditions";
import {Modal} from "antd";
import {Link} from "react-router-dom";
import LogRocket from "logrocket";

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

        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);

        let nextLocation = params.get('redirect') || '/scholarship';

        if (nextLocation==='/') {
            nextLocation = '/scholarship';
        }
        this.state = {
            userProfile: {
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
                agreeTermsConditions: false,
            },
            nextLocation,
            isResponseError: null,
            responseOkMessage: null,
            loadingResponse: null,
            isTermsConditionsModalVisible: false,
        };
    }

    updateForm = (event) => {

        if (event.stopPropagation) {
            event.stopPropagation();
        }
        const userProfile = {...this.state.userProfile};
        userProfile[event.target.name] = event.target.value;

        if (event.target.type==='checkbox'){
            userProfile[event.target.name] = event.target.checked
        }

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
        const { setLoggedInUserProfile } = this.props;
        const { userProfile, nextLocation } = this.state;
        const { email, username, password } = userProfile;

        this.setState({ loadingResponse: true});
        this.setState({ isResponseError: null});

        const userProfileSendData = {
            first_name: userProfile.firstName,
            last_name: userProfile.lastName,
            email, username,
        };

        LogRocket.identify(email, {
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            email: email
        });

        UserProfileAPI
            .createUser({
                userProfile: userProfileSendData,
                user: { email, username, password },
                locationData: null
            })
            .then(res => {

                this.setState({ responseOkMessage: 'Registration successful 🙂! Redirecting...'});
                UserProfileAPI.authenticateRequests(res.data.token, res.data.id);
                setLoggedInUserProfile(res.data.user_profile);
                this.props.history.push(nextLocation);
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    let isResponseError = err.response.data;
                    isResponseError = (
                        <p className="text-danger">
                            {isResponseError.message || isResponseError.error}
                        </p>);
                    this.setState({ isResponseError });
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
                this.setState({ loadingResponse: false});
            })
    };

    render () {

        const { userProfile, isResponseError, responseOkMessage,
            loadingResponse, isTermsConditionsModalVisible } = this.state;
        const { firstName, lastName, username, email, password, agreeTermsConditions } = userProfile;
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
                            <div className="col-12 mb-3">
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
                            {responseOkMessage &&
                            <p className="text-success">
                                {responseOkMessage}
                            </p>
                            }
                            {isResponseError &&
                             isResponseError
                            }
                            {loadingResponse &&
                            <Loading title="Loading Response..." className="center-block my-3"/>}
                            <button className="btn btn-primary col-12 mb-3"
                                    type="submit"
                                    disabled={loadingResponse || !agreeTermsConditions}>
                                Register
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = {
    setLoggedInUserProfile
};

Register.propTypes = {
    setLoggedInUserProfile: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Register);

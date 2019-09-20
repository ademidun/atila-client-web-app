import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import UserProfileAPI from "../services/UserProfileAPI";
import Loading from "./Loading";
import {PasswordShowHide} from "./Register";
import {setLoggedInUserProfile} from "../redux/actions/user";

class Login extends React.Component {

    _isMounted = false;
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            isResponseError: null,
            loadingResponse: null,
            isResponseOk: null,
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
        const { username, password } = this.state;
        const { setLoggedInUserProfile } = this.props;
        this.setState({ loadingResponse: true});
        this.setState({ isResponseError: null});
        UserProfileAPI
            .login({ username, password })
            .then(res => {
                this.setState({ isResponseOk: true});
                setLoggedInUserProfile(res.data.user_profile);
                UserProfileAPI.authenticateRequests(res.data.token, res.data.id);
                this.props.history.push(`/scholarship`);
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({ isResponseError: err.response.data});
                }
            })
            .finally(res => {
                if (this._isMounted) {
                    this.setState({ loadingResponse: false});
                }
            })
    };

    render () {
        const { username, password,
            isResponseError, loadingResponse,
            isResponseOk } = this.state;
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <div>
                        <h1>Login</h1>
                        <form className="row p-3 form-group" onSubmit={this.submitForm}>
                            <input placeholder="Username or Email"
                                   className="col-12 mb-3 form-control"
                                   name="username"
                                   value={username}
                                   autoComplete="username"
                                   onChange={this.updateForm}
                            />
                            <PasswordShowHide password={password} updateForm={this.updateForm} />
                            {isResponseOk &&
                            <p className="text-success">
                                Login successful! Redirecting...
                                <span role="img" aria-label="happy face emoji">🙂</span>
                            </p>
                            }
                            {isResponseError &&
                            <p className="text-danger">
                                {isResponseError.message}
                            </p>
                            }
                            {loadingResponse &&
                            <Loading title="Loading Response..." className="center-block my-3"/>}
                            <div className="w-100">
                                <button className="btn btn-primary col-sm-12 col-md-5 float-left mb-3"
                                        type="submit"
                                        disabled={loadingResponse}>
                                    Login
                                </button>
                                <Link to="/register"
                                      className="btn btn-outline-primary col-sm-12 col-md-5 float-right">
                                    Register
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = () => {
    return {
        setLoggedInUserProfile
    };
};

Login.propTypes = {
    setLoggedInUserProfile: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps())(Login);

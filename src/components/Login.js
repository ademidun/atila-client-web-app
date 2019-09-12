import React from 'react';
import UserProfileAPI from "../services/UserProfileAPI";
import Loading from "./Loading";
import {Link} from "react-router-dom";
import {PasswordShowHide} from "./Register";

class Login extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            isResponseError: null,
            loadingResponse: null,
        };
    }

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value})
    };

    submitForm = (event) => {
        event.preventDefault();
        console.log({ event });
        const { username, password } = this.state;
        this.setState({ loadingResponse: true});
        this.setState({ isResponseError: null});
        UserProfileAPI
            .login({ username, password })
            .then(res => {
                console.log({ res });
                localStorage.setItem('token', res.data.token);
                UserProfileAPI.authenticateRequests();
            })
            .catch(err => {
                console.log({ err });
                if (err.response && err.response.data) {
                    this.setState({ isResponseError: err.response.data});
                }
            })
            .finally(res => {
                console.log({ res });
                this.setState({ loadingResponse: false});
            })
    };

    render () {

        const { username, password, isResponseError, loadingResponse } = this.state;
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
                            {isResponseError &&
                            <p className="text-danger">
                                {isResponseError.message}
                            </p>
                            }
                            {loadingResponse &&
                            <Loading title="Loading Response..." className="center-block my-3"/>}
                            <div className="w-100">
                                <button className="btn btn-primary col-sm-12 col-md-5 float-left"
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

export default Login;

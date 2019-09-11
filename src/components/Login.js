import React from 'react';
import UserProfileAPI from "../services/UserProfileAPI";
import Loading from "./Loading";

class Login extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            loginError: null,
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
                    this.setState({ loginError: err.response.data});
                }
            })
            .finally(res => {
                console.log({ res });
                this.setState({ loadingResponse: false});
            })
    };

    render () {

        const { username, password, loginError, loadingResponse } = this.state;
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <div>
                        <h3>Login</h3>
                        <form className="row p-3 form-group" onSubmit={this.submitForm}>
                            <input placeholder="Username or Email"
                                   className="col-12 mb-3 form-control"
                                   name="username"
                                   value={username}
                                   onChange={this.updateForm}
                            />
                            <input placeholder="Password"
                                   name="password"
                                   type="password"
                                   className="col-12 mb-3 form-control"
                                   value={password}
                                   onChange={this.updateForm}
                            />
                            {loginError &&
                            <p className="text-danger">
                                {loginError.message}
                            </p>
                            }
                            {loadingResponse &&
                            <Loading title="Loading Response..." className="center-block my-3"/>}
                            <button className="btn btn-primary col-12 mb-3"
                                    type="submit"
                                    disabled={loadingResponse}>
                                Login
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;

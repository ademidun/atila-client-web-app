import React from 'react';

class Login extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    }

    updateForm = (event) => {
        console.log({ event });
    };

    submitForm = (event) => {
        console.log({ event });
    };

    render () {

        const { username, password } = this.state;
        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <div>
                        <h3>Login</h3>
                        <form className="row p-3 form-group" onSubmit={this.submitForm}>
                            <input placeholder="Username"
                                   className="col-12 mb-3 form-control"
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
                            <button className="btn btn-primary col-12 mb-3" type="submit">
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

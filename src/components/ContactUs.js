import React from "react";

class ContactUs extends  React.Component{


    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            contactMessage: '',
        }
    }


    submitContact = (event) => {
        event.preventDefault();
        const { state } = this;
        console.log({ state });
    };

    updateName = (event) => {
        event.preventDefault();
        this.setState({fullName: event.target.value});

    };

    updateMessage = (event) => {
        event.preventDefault();
        console.log({event});
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.onSubmit();
        }

        this.setState({contactMessage: event.target.value});

    };

    render() {
        const { fullName, contactMessage } = this.state;
        return (
            <div className="container m-3">
                <div className="card shadow p-3">
                    <h3>Contact Us</h3>
                    <p>Or send us an email at {' '}
                        <a href="mailto:info@atila.ca" target="_blank" rel="noopener noreferrer">info@atila.ca
                        </a>
                    </p>
                    {/*<form method="post"*/}
                    {/*      className="probootstrap-form"*/}
                    {/*      action="https://script.google.com/macros/s/AKfycbz-KUtAK4P51p-0bWJCne5USIlyCbLtwSSMpSBIK0BxkMFUG0w/exec">*/}
                    <form className="row p-3 form-group" onSubmit={this.submitContact}>
                        <input placeholder="Full Name"
                               className="col-12 mb-3 form-control"
                                value={fullName}
                               onChange={this.updateName}
                        />
                        <textarea
                            placeholder="Message"
                            className="col-12 mb-3 form-control"
                            value={contactMessage}
                            onChange={this.updateMessage}
                            rows="5"

                        />
                        <button className="btn btn-primary col-12 mb-3" type="submit">
                            Send
                        </button>

                    </form>
                </div>
            </div>
        );
    }
}

export default ContactUs;
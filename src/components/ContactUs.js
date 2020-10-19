import React from "react";
import UtilsAPI from "../services/UtilsAPI";
import Loading from "./Loading";
class ContactUs extends  React.Component{


    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            contactMessage: '',
            email: '',
            isLoadingResponse: false,
            errorReceivingResponse: false,
            isReceivedResponse: false
        }
    }


    submitContact = (event) => {
        event.preventDefault();
        const { fullName, contactMessage, email } = this.state;

        this.setState({ isLoadingResponse: true });
        UtilsAPI.postGoogleScript({ name: fullName, message: contactMessage, email })
            .then(res=> {
                this.setState({ isReceivedResponse: true });
            })
            .catch(err=>{
                this.setState({ errorReceivingResponse: err });

            })
            .finally(()=>{
                this.setState({ isLoadingResponse: false });
            })
    };

    updateName = (event) => {
        event.preventDefault();
        this.setState({fullName: event.target.value});

    };

    updateEmail = (event) => {
        event.preventDefault();
        this.setState({ email: event.target.value });
    };

    updateMessage = (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.onSubmit();
        }

        this.setState({contactMessage: event.target.value});

    };

    render() {
        const { fullName, email, contactMessage, isLoadingResponse,
            isReceivedResponse, errorReceivingResponse } = this.state;

        let pageContent = null;

        if (isLoadingResponse) {
            pageContent = (
                <Loading
                    isLoading={isLoadingResponse}
                    title={`Sending Form Please wait...`} />);
        }
        else if (isReceivedResponse) {
            pageContent = <div className="text-center" style={{ height: '300px', marginTop: '150px' }}>
                <h4>
                    Thanks for Contacting Us
                    <span role="img" aria-label="happy face emoji">🙂</span>
                </h4>
                <h6>We will get back to you within 24 hours</h6>
            </div>
        }
        else if (errorReceivingResponse) {
            pageContent = <div className="text-center" style={{ height: '300px', marginTop: '150px' }}>
                <h4>
                    Sorry, there was an error sending your form
                    <span role="img" aria-label="sad face emoji">😕</span>
                </h4>
                <h6>Please send us an email at {' '}
                    <a href="mailto:info@atila.ca" target="_blank" rel="noopener noreferrer">
                        info@atila.ca
                    </a></h6>
            </div>
        }
        else {
            pageContent = (<React.Fragment>
                <h3>Contact Us</h3>
                <p>You can also chat with us by clicking the chat icon
                    in the bottom right of your screen or send us an email at {' '}
                    <a href="mailto:info@atila.ca" target="_blank" rel="noopener noreferrer">
                        info@atila.ca </a>
                    or ask us on <a href="https://www.reddit.com/r/atila/" target="_blank" rel="noopener noreferrer" >reddit (r/atila)</a>
                </p>
                <form className="row p-3 form-group" onSubmit={this.submitContact}>
                    <input placeholder="Full Name"
                           className="col-12 mb-3 form-control"
                           value={fullName}
                           onChange={this.updateName}
                    />
                    <input placeholder="Email"
                           name="email"
                           type="email"
                           className="col-12 mb-3 form-control"
                           value={email}
                           onChange={this.updateEmail}
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
            </React.Fragment>)
        }

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    {pageContent}
                </div>
            </div>
        );
    }
}

export default ContactUs;
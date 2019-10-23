import React from "react";
import UtilsAPI from "../services/UtilsAPI";
import Loading from "./Loading";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
class SubscribeMailingList extends  React.Component{


    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            email: '',
            isLoadingResponse: false,
            errorReceivingResponse: false,
            isReceivedResponse: false
        }
    }


    submitContact = (event) => {
        event.preventDefault();
        const { fullName, email } = this.state;


        if(!fullName || !email) {
            return
        }

        const { formGoogleSheetName, location: { pathname } } = this.props;

        this.setState({ isLoadingResponse: true });
        UtilsAPI.postGoogleScript({
            name: fullName,
            formGoogleSheetName: formGoogleSheetName,
            skipSendEmail: true,
            referrer: pathname,
            email, })
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

    render() {
        const { fullName, email, isLoadingResponse,
            isReceivedResponse, errorReceivingResponse } = this.state;

        const { btnText, subscribeText } = this.props;

        let pageContent = null;

        if (isLoadingResponse) {
            pageContent = (
                <Loading
                    isLoading={isLoadingResponse}
                    title={`Sending Form Please wait...`} />);
        }
        else if (isReceivedResponse) {
            pageContent = <div className="text-center">
                <h4>
                    Thanks for Subscribing
                    <span role="img" aria-label="happy face emoji">🙂</span>
                </h4>
            </div>
        }
        else if (errorReceivingResponse) {
            pageContent = <div className="text-center">
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
                {subscribeText}
                <form className="row p-3 form-group" onSubmit={this.submitContact}>
                    <input placeholder="Full Name"
                           name="name"
                           className="col-sm-12 col-md-6 mb-3 form-control"
                           value={fullName}
                           onChange={this.updateName}
                    />
                    <input placeholder="Email"
                           name="email"
                           type="email"
                           className="col-12 col-md-6 mb-3 form-control"
                           value={email}
                           onChange={this.updateEmail}
                    />
                    <button className="btn btn-primary col-12 mb-3" type="submit">
                        {btnText}
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

SubscribeMailingList.defaultProps = {
    btnText: 'Subscribe',
    subscribeText: (
        <p className="col-sm-12 col-md-6" style={{fontSize : 'medium'}}>Subscribe to get updates
            on new <Link to="/" >scholarships</Link>, <Link to="/blog" >blog</Link> and {' '}
            <Link to="/essay" >essays</Link>, and new product features.
        </p>),
    formGoogleSheetName: 'mailinglist',
};

SubscribeMailingList.propTypes = {
    btnText: PropTypes.string,
    formGoogleSheetName: PropTypes.string,
    subscribeText: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.string,
    ])
};

export default withRouter(SubscribeMailingList);
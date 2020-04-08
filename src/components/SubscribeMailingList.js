import React from "react";
import UtilsAPI from "../services/UtilsAPI";
import Loading from "./Loading";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {Col, Row} from "antd";
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

        const { formGoogleSheetName, location: { pathname }, skipSendEmail } = this.props;

        this.setState({ isLoadingResponse: true });

        const formData = {
            name: fullName,
            formGoogleSheetName: formGoogleSheetName,
            referrer: pathname,
            email,
            };

        // only set skipSendEmail if the value is true, because setting the value to false
        // interprets it as "false" which becomes truthy in the Google Macros Script
        // see: https://github.com/ademidun/atila-client-web-app/pull/4

        if (skipSendEmail) {
            formData.skipSendEmail = skipSendEmail
        }

        UtilsAPI.postGoogleScript(formData)
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

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    };

    render() {
        const { fullName, email, isLoadingResponse,
            isReceivedResponse, errorReceivingResponse } = this.state;

        const { buttonText, subscribeText, successResponse } = this.props;

        let pageContent = null;

        if (isLoadingResponse) {
            pageContent = (
                <Loading
                    isLoading={isLoadingResponse}
                    title={`Sending Form Please wait...`} />);
        }
        else if (isReceivedResponse) {
            pageContent = successResponse;
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
                <form className="form-group" onSubmit={this.submitContact}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} className="my-3">
                            <input className="form-control"
                                   placeholder="Full Name"
                                   name="fullName"
                                   value={fullName}
                                   onChange={this.updateForm}
                            />
                        </Col>
                        <Col xs={24} sm={12} className="my-3">
                            <input className="form-control"
                                   placeholder="Email"
                                   name="email"
                                   type="email"
                                   value={email}
                                   onChange={this.updateForm}
                            />
                        </Col>
                    </Row>
                    <button className="btn btn-primary col-12 mb-3" type="submit">
                        {buttonText}
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
    buttonText: 'Subscribe',
    skipSendEmail: true,
    subscribeText: (
        <p className="col-sm-12 col-md-6" style={{fontSize : 'medium'}}>Subscribe to get updates
            on new <Link to="/scholarship" >scholarships</Link>, <Link to="/blog" >blog</Link> and {' '}
            <Link to="/essay" >essays</Link>, and new product features.
        </p>),
    formGoogleSheetName: 'mailinglist',
    successResponse: (<div className="text-center">
        <h4>
            Thanks for Subscribing
            <span role="img" aria-label="happy face emoji">🙂</span>
        </h4>
    </div>),
};

SubscribeMailingList.propTypes = {
    buttonText: PropTypes.bool,
    skipSendEmail: PropTypes.string,
    formGoogleSheetName: PropTypes.string,
    subscribeText: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.string,
    ]),
    successResponse: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.string,
    ])
};

export default withRouter(SubscribeMailingList);

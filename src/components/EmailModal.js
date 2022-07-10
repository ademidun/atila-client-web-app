import React from 'react';
import ButtonModal from "./ButtonModal";
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import {Alert, Input} from "antd";
import Loading from "./Loading";
import PropTypes from "prop-types";
import {ScholarshipPropType} from "../models/Scholarship";

const { TextArea } = Input;

class EmailModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            emailSubject: "",
            emailBody: "",
            loading: null,
            responseMessage: null,
        }
    }

    updateEmail = event => {
        if (event.target.name === "email-subject") {
            this.setState({emailSubject: event.target.value,});
        } else if (event.target.name === "email-body") {
            this.setState({emailBody: event.target.value,});
        }
    };

    sendEmail = () => {
        const { application, scholarship } = this.props;
        const { emailSubject, emailBody } = this.state;
        const scholarshipID = scholarship.id;
        const postData = {subject: emailSubject, body: emailBody, 'type': 'single', application_id: application.id};

        this.setState({loading: "Emailing applicants..."});

        ScholarshipsAPI
            .emailApplicants(scholarshipID, postData)
            .then(res=> {
                // response returns these if they're needed in the future.
                // const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;

                this.setState({responseMessage: "Email has been sent!"});
            })
            .catch(err=>{
                console.log({err});

                this.setState({responseMessage: "There was an error sending the email.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })
            .finally(() => {
                this.setState({loading: null});
            });
    }

    render() {
        const { emailSubject, emailBody, loading, responseMessage } = this.state;
        const { showModalButtonSize, showModalText, modalTitle } = this.props;
        console.log({showModalButtonSize});

        let emailModalBody = (
            <>
                <Input name='email-subject' 
                       value={emailSubject} 
                       onChange={this.updateEmail} 
                       className="mb-2" 
                       placeholder={"Email subject..."}/>

                <TextArea name='email-body' 
                          value={emailBody} 
                          onChange={this.updateEmail} 
                          rows={6} 
                          placeholder={"Email body..."}/>

                {loading &&
                <>
                    <br/>
                    <br/>
                    <Loading title={loading} />
                </>
                }
            </>
        )

        return (
            <div>
                <ButtonModal
                        showModalButtonSize={showModalButtonSize | "medium"}
                        showModalText={showModalText}
                        modalTitle={modalTitle}
                        modalBody={emailModalBody}
                        submitText={"Send Email..."}
                        onSubmit={this.sendEmail}
                        addPopConfirm={true}
                        disabled={loading}
                        popConfirmText={"Are you sure you want to send the email?"}
                />
                {responseMessage &&
                <>
                    <br />
                    <Alert message={responseMessage} />
                </>
                }
            </div>
        )
    }
}

EmailModal.propTypes = {
    showModalButtonSize: PropTypes.string,
    showModalText: PropTypes.string,
    modalTitle: PropTypes.string,
    application: PropTypes.any, // An Application
    scholarship: ScholarshipPropType,
}

EmailModal.defaultProps = {
    showModalButtonSize: "medium",
    showModalText: "Show Modal",
    modalTitle: "Modal Title",
    application: null,
    scholarship: null,
}

export default EmailModal;

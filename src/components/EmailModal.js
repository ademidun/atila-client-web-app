import React from 'react';
import ButtonModal from "./ButtonModal";
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import { Input } from "antd";
import Loading from "./Loading";

const { TextArea } = Input;

class EmailModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            emailSubject: "",
            emailBody: "",
            loading: null
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

                // toastNotify
                // this.setState({responseMessage: "All applicants have been emailed!"});
            })
            .catch(err=>{
                console.log({err});
                // toastNotify
                // this.setState({responseMessage: "There was an error emailing the applicants.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })
            .finally(() => {
                this.setState({loading: null});
            });
    }

    render() {
        const { emailSubject, emailBody, loading } = this.state;
        const { showModalButtonSize, showModalText, modalTitle } = this.props;

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
            </div>
        )
    }
}


export default EmailModal;

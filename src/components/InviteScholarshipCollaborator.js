import React from 'react';
import ButtonModal from "./ButtonModal";
import AutoCompleteRemoteData from "./AutoCompleteRemoteData";
import {UserProfilePreview} from "./ReferredByInput";
import {MinusCircleOutlined} from "@ant-design/icons";
import {Input, Switch} from "antd";
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import PropTypes from "prop-types";
import {ScholarshipPropType} from "../models/Scholarship";
import {toastNotify} from "../models/Utils";
import Loading from "./Loading";

class InviteScholarshipCollaborator extends  React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            invitedCollaborator: null,
            invitedEmail: "",
            isInviteViaEmail: false,
        }
    }

    inviteCollaborator = () => {
        const { invitedCollaborator, invitedEmail, isInviteViaEmail } = this.state;
        const { scholarship, source, onInviteSuccess, onInviteError, pendingInvitesCB } = this.props;
        this.setState({loading: "Sending invite..."})

        if (isInviteViaEmail) {
            ScholarshipsAPI
                .inviteCollaboratorViaEmail(scholarship.id, invitedEmail, source)
                .then(res => {
                    const { invites: pending_invites } =  res.data;
                    this.setState({invitedEmail: ""})

                    const msg = `${invitedEmail} has been sent an invite.`
                    onInviteSuccess(msg)

                    if (pending_invites) {
                        pendingInvitesCB(pending_invites)
                    }
                })
                .catch(err => {
                    console.log({err});
                    const { response_message } = err.response.data;
                    let msg = `There was an error inviting ${invitedEmail}.\n\n Please message us using the chat icon in the bottom right of your screen.`;
                    if (response_message) {
                        msg = response_message
                    }
                    onInviteError(msg)
                })
                .finally(() => {
                    this.setState({loading: null})
                });
        } else {
            ScholarshipsAPI
                .inviteCollaborator(scholarship.id, invitedCollaborator.username)
                .then(res => {
                    this.setState({invitedCollaborator: null});
                    const msg = `${invitedCollaborator.username} has been sent an invite email.`
                    onInviteSuccess(msg)
                })
                .catch(err => {
                    console.log({err});
                    const {response_message} = err.response.data;
                    let msg = `There was an error inviting ${invitedCollaborator}.\n\n Please message us using the chat icon in the bottom right of your screen.`
                    if (response_message) {
                        msg = response_message
                    }
                    onInviteError(msg)
                })
                .finally(() => {
                    this.setState({loading: null})
                });
        }
    }

    render() {
        const { invitedCollaborator, invitedEmail, isInviteViaEmail, loading } = this.state;
        const { isButtonDisabled } = this.props;

        let inviteCollaboratorModalBody = (
            <>
                Invite an Atila user to collaborate on this scholarship.
                <br /> <br />
                <AutoCompleteRemoteData placeholder={"Collaborator's username or name..."}
                                        onSelect={(userProfile)=>{this.setState({invitedCollaborator: userProfile})}}
                                        type="user" />

                {invitedCollaborator &&
                    <div className="my-2">
                        Pending invite: <br/>
                        <UserProfilePreview userProfile={invitedCollaborator} />

                        <MinusCircleOutlined
                            style={{
                                fontSize: "30px",
                            }}
                            onClick={()=>{
                                this.setState({invitedCollaborator: null})
                            }}
                        />
                    </div>
                }
            </>
        )

        let inviteCollaboratorViaEmailModalBody = (
            <>
                Invite anyone to collaborate with their email.
                <br /><br />
                <Input  value={invitedEmail}
                        onChange={e=>this.setState({invitedEmail: e.target.value})}
                        placeholder={"Collaborator's email..."}
                />
            </>
        )

        let inviteModalBody = (
            <>
                {loading &&
                    <Loading title={loading} />
                }
                <Switch checked={isInviteViaEmail}
                        onChange={(checked) => {this.setState({isInviteViaEmail: checked})}} />
                &nbsp;&nbsp;Invite with email
                <br />
                <hr />
                {isInviteViaEmail ? inviteCollaboratorViaEmailModalBody : inviteCollaboratorModalBody}
            </>
        )

        return (
            <div>
                <ButtonModal
                    showModalButtonSize={"large"}
                    showModalText={"Invite Collaborator"}
                    modalTitle={"Invite Collaborator"}
                    modalBody={inviteModalBody}
                    submitText={"Send Invite"}
                    onSubmit={this.inviteCollaborator}
                    disabled={isButtonDisabled}
                />
            </div>
        );
    }
}

InviteScholarshipCollaborator.defaultProps = {
    isButtonDisabled: false,
    source: "manage",
    onInviteSuccess: (msg) => {toastNotify(msg)},
    onInviteError: (err) => {toastNotify(err,"error")},
    pendingInvitesCB: (pending_invites) => {},
}

InviteScholarshipCollaborator.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
    isButtonDisabled: PropTypes.bool,
    source: PropTypes.string,  // "edit" or "manage"
    onInviteSuccess: PropTypes.func, // Callback function on success
    onInviteError: PropTypes.func, // Callback function on error
    pendingInvitesCB: PropTypes.func, // cb function to store pending_invites if needed
};

export default InviteScholarshipCollaborator

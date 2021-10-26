import React from 'react';
import ButtonModal from "./ButtonModal";
import AutoCompleteRemoteData from "./AutoCompleteRemoteData";
import {UserProfilePreview} from "./ReferredByInput";
import {MinusCircleOutlined} from "@ant-design/icons";
import {Input} from "antd";
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import PropTypes from "prop-types";
import {ScholarshipPropType} from "../models/Scholarship";


class InviteScholarshipCollaborator extends  React.Component {
    constructor(props) {
        super(props);

        this.state = {
            invitedCollaborator: null,
            invitedEmail: "",
        }
    }

    inviteCollaborator = () => {
        const { invitedCollaborator } = this.state;
        const { scholarship, setParentState } = this.props;
        setParentState({isLoadingMessage: "Inviting collaborators..."});
        ScholarshipsAPI
            .inviteCollaborator(scholarship.id, invitedCollaborator.username)
            .then(res => {
                const {scholarship} =  res.data;
                this.setState({invitedCollaborator: null});
                
                setParentState({scholarship, responseMessage: `${invitedCollaborator.username} has been sent an invite email.`})
            })
            .catch(err => {
                console.log({err});
                const { response_message } = err.response.data;
                if (response_message) {
                    setParentState({responseMessage: response_message});
                } else {
                    setParentState({responseMessage: `There was an error inviting ${invitedCollaborator}.\n\n Please message us using the chat icon in the bottom right of your screen.`})
                }
            })
            .then(() => {
                setParentState({isLoadingMessage: null});
            });
    }

    inviteCollaboratorViaEmail = () => {
        const { invitedEmail } = this.state;
        const { scholarship, setParentState } = this.props;

        setParentState({isLoadingMessage: "Sending invite..."});
        ScholarshipsAPI
            .inviteCollaboratorViaEmail(scholarship.id, invitedEmail)
            .then(res => {
                const { scholarship, invites: pending_invites } =  res.data;

                this.setState({invitedEmail: ""})
                setParentState({ scholarship, responseMessage: `${invitedEmail} has been sent an invite.` });
                if (pending_invites) {
                    setParentState({ pending_invites })
                }
            })
            .catch(err => {
                console.log({err});
                const { response_message } = err.response.data;
                if (response_message) {
                    setParentState({responseMessage: response_message});
                } else {
                    setParentState({responseMessage: `There was an error inviting ${invitedEmail}.\n\n Please message us using the chat icon in the bottom right of your screen.`})
                }
            })
            .then(() => {
                setParentState({isLoadingMessage: null});
            });
    }

    render() {
        const { invitedCollaborator, invitedEmail } = this.state;
        const { isButtonDisabled } = this.props;

        let inviteCollaboratorModalBody = (
            <>
                Invite an Atila user to collaborate on this scholarsip.
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
                Invite a non-Atila user to collaborate on this scholarship by entering their email.
                <br /><br />
                <Input  value={invitedEmail}
                        onChange={e=>this.setState({invitedEmail: e.target.value})}
                        placeholder={"Collaborator's email..."}
                />
            </>
        )

        return (
            <div>
                <ButtonModal
                    showModalButtonSize={"large"}
                    showModalText={"Invite Collaborator (Atila User)..."}
                    modalTitle={"Invite Collaborator"}
                    modalBody={inviteCollaboratorModalBody}
                    submitText={"Send Invite"}
                    onSubmit={this.inviteCollaborator}
                    disabled={isButtonDisabled}
                />
                <br />
                {/*Only allow the scholarship owner to see the invite button. May want to be changed in the future.*/}
                <ButtonModal
                    showModalButtonSize={"large"}
                    showModalText={"Invite Collaborator (Email)..."}
                    modalTitle={"Invite Collaborator via Email"}
                    modalBody={inviteCollaboratorViaEmailModalBody}
                    submitText={"Send Invite"}
                    onSubmit={this.inviteCollaboratorViaEmail}
                    disabled={isButtonDisabled}
                />
            </div>
        );
    }
}

InviteScholarshipCollaborator.defaultProps = {
    isButtonDisabled: false,
    setParentState: () => {},
}

InviteScholarshipCollaborator.propTypes = {
    isButtonDisabled: PropTypes.bool,
    scholarship: ScholarshipPropType.isRequired,
    setParentState: PropTypes.func,
};

export default InviteScholarshipCollaborator

import React from 'react';
import ButtonModal from "./ButtonModal";

class ReportIncorrectInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <>
                <ButtonModal
                    showModalButtonSize={"medium"}
                    showModalButtonDanger={true}
                    showModalButtonType={""}
                    showModalText={"Report Incorrect Information"}
                    modalTitle={"Report"}
                    modalBody={<></>}
                    submitText={"Send Report"}
                    onSubmit={this.inviteCollaborator}
                />
            </>
        )
    }

}

export default ReportIncorrectInfo
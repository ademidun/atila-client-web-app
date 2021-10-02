import React, { useState } from 'react';
import {Button, InputNumber} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import ButtonModal from "../../components/ButtonModal";

function AssignReviewers({scholarship, showAsModal = false, onResponse}) {
    const [reviewersPerApplication, setReviewersPerApplication] = useState(2);
    const [isLoadingMessage, setisLoadingMessage] = useState("");

    const { collaborators, owner_detail } = scholarship;

    const reviewers = [owner_detail, ...collaborators];
    const showModalText = "Auto Assign Reviewers...";

    const autoAssignReviewers = () => {
        setisLoadingMessage("Auto assigning reviewers...");

        ScholarshipsAPI
            .assignReviewers(scholarship.id, reviewersPerApplication)
            .then(res=> {
                if (onResponse) {
                    onResponse(res.data);
                }
            })
            .catch(err=>{
                console.log({err});
                const { response_message } = err.response.data;
                if (response_message) {
                    this.setState({responseMessage: response_message});
                } else {
                    this.setState({responseMessage: "There was an error assigning reviewers.\n\n Please message us using the chat icon in the bottom right of your screen."});
                }
            })
            .finally(() => {
                setisLoadingMessage(null);
            });

    }

    let assignReviewersModalBody = (<>
        <div>
            <h6>Number of reviewers per application</h6>
            <InputNumber value={reviewersPerApplication}
                         min={1}
                         max={reviewers.length}
                         step={1}
                         onChange={setReviewersPerApplication} />
            {(reviewersPerApplication > reviewers.length || reviewersPerApplication < 1) &&
            <p style={{"color": "red"}}>
                Reviewers per application must be {  reviewersPerApplication < 1 ?
                "greater than 0" : `less than or equal to the number of reviewers (${reviewers.length})`}
            </p>
            }
        </div>
    </>);

    if (!showAsModal) {
        return (
        <> 
        {assignReviewersModalBody}
        <br/>
        <Button onClick={autoAssignReviewers}
                disabled={isLoadingMessage || scholarship.is_winner_selected}
                >
                    {showModalText}
                </Button>
        </>
        )
    }

    return (
        <ButtonModal
                showModalButtonSize={"large"}
                showModalText={showModalText}
                modalTitle={"Auto Assign Reviewers"}
                modalBody={assignReviewersModalBody}
                submitText={"Confirm Auto Assigning"}
                onSubmit={autoAssignReviewers}
                disabled={isLoadingMessage || scholarship.is_winner_selected}
            />
        
    )
}

AssignReviewers.propTypes = {

}

export default AssignReviewers


import React, { useState } from 'react';
import {Button, InputNumber, Checkbox, Divider, Alert} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import ButtonModal from "../../components/ButtonModal";
import { UserProfilePreview } from '../../components/ReferredByInput';
import Loading from '../../components/Loading';

function AssignReviewers({scholarship, showAsModal = false, onResponse}) {

    const { collaborators, owner_detail } = scholarship;
    const reviewers = [owner_detail, ...collaborators];
    const showModalText = "Auto Assign Reviewers...";


    const [reviewersPerApplication, setReviewersPerApplication] = useState(2);
    const [isLoadingMessage, setisLoadingMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedReviewers, setSelectedReviewers] = useState(reviewers.map(reviewer => reviewer.user));

    const autoAssignReviewers = () => {
        setisLoadingMessage("Auto assigning reviewers...");

        ScholarshipsAPI
            .assignReviewers(scholarship.id, reviewersPerApplication, selectedReviewers)
            .then(res=> {
                if (onResponse) {
                    onResponse(res.data);
                }
            })
            .catch(err=>{
                console.log({err});
                const { response_message } = err.response.data;
                if (response_message) {
                    setErrorMessage(response_message)
                } else {
                    setErrorMessage("There was an error assigning reviewers.\n\n Please message us using the chat icon in the bottom right of your screen.");
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
            <hr/>
            <SelectReviewers reviewers={reviewers} onChangeSelectedReviewers={(reviewersSelected => setSelectedReviewers(reviewersSelected) )} />
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
        <>
        <ButtonModal
                showModalButtonSize={"large"}
                showModalText={showModalText}
                modalTitle={"Auto Assign Reviewers"}
                modalBody={assignReviewersModalBody}
                submitText={"Confirm Auto Assigning"}
                onSubmit={autoAssignReviewers}
                disabled={isLoadingMessage || scholarship.is_winner_selected}
            />
            {isLoadingMessage && 
                <Loading title={isLoadingMessage} className='mt-3' />
            } <br />
            {errorMessage &&
                <Alert type="error" message={errorMessage} />
            }
        </>
        
    )
}

function SelectReviewers({reviewers, onChangeSelectedReviewers}) {

    const CheckboxGroup = Checkbox.Group;
    const reviewerOptions = reviewers.map(reviewer => {

        return {
            value: reviewer.user,
            label: <UserProfilePreview userProfile={reviewer} />
        }
    });
    const defaultCheckedList = reviewers.map(reviewer => reviewer.user);


    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(true);
  
    const onChange = list => {
      setCheckedList(list);
      setIndeterminate(!!list.length && list.length < reviewerOptions.length);
      setCheckAll(list.length === reviewerOptions.length);
      onChangeSelectedReviewers(list);
    };
  
    const onCheckAllChange = e => {
      setCheckedList(e.target.checked ? reviewerOptions : []);
      setIndeterminate(false);
      setCheckAll(e.target.checked);
    };
  
    return (
      <div>
        <p>
            Who do you want to review applications?
        </p>
        <Divider />
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Check all
        </Checkbox>
        <Divider />
        <CheckboxGroup options={reviewerOptions} value={checkedList} onChange={onChange} />
      </div>
    );
  };

AssignReviewers.propTypes = {

}

export default AssignReviewers


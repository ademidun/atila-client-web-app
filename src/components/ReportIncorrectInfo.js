import React from 'react';
import ButtonModal from "./ButtonModal";
import { Radio, Input} from 'antd';
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import { toastNotify } from "../models/Utils";

const { TextArea } = Input;
const incorrectInfoOptions = [
    "Wrong Deadline",
    "No longer available",
    "Other",
]

class ReportIncorrectInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            infoOptionsIndex: 0,
            additionalInfo: "",
            updatedDeadline: null,
        };
    }

    sendReport = () => {
        const { infoOptionsIndex, additionalInfo, updatedDeadline } = this.state;
        const { scholarship } = this.props;

        let postAdditionalInfo = additionalInfo;

        if (infoOptionsIndex === 0 && updatedDeadline) {
            postAdditionalInfo = `New deadline suggested by user: ${updatedDeadline}. ${postAdditionalInfo}`
        }

        const postData = {
            "incorrect_info": incorrectInfoOptions[infoOptionsIndex],
            "additional_info": postAdditionalInfo
        }

        ScholarshipsAPI
            .reportIncorrectInfo(scholarship.id, postData)
            .then(res => {
                const successMessage = "Your report has been delivered. Thanks for making Atila more reliable.";
                toastNotify(successMessage);
            })
            .catch(err => {
                console.log({err})
                const errorMessage = "An error occurred. Please message us using the chat button in the bottom right.";
                toastNotify(errorMessage, 'error')
            })
    }

    onRadioSelect = e => {
        this.setState({
            infoOptionsIndex: e.target.value,
        });
    };

    onAdditionalInfoChange = e => {
        this.setState({
            additionalInfo: e.target.value
        })
    }

    onUpdatedDeadlineChange = event => {
        if (event.stopPropagation) {
            event.stopPropagation(); // https://github.com/facebook/react/issues/3446#issuecomment-82751540
        }
        this.setState({updatedDeadline: event.target.value});
    }

    render() {
        const { infoOptionsIndex, additionalInfo, updatedDeadline } = this.state;
        const radioStyle = {
            display: 'block',
            lineHeight: '30px',
        };

        let radioOptions = incorrectInfoOptions.map((optionText, index) => (
            <Radio style={radioStyle} value={index}>
                {optionText}
                {infoOptionsIndex === 0 && index === 0 &&
                <>
                    <br />
                    <input placeholder={"test"}
                           className="col-12 form-control floating__input"
                           name={"date"}
                           type={"datetime-local"}
                           onChange={this.onUpdatedDeadlineChange}
                           value={updatedDeadline}
                    />
                </>
                }
            </Radio>
        ))

        let reportIncorrectInfoModalBody = (
            <>
                <Radio.Group onChange={this.onRadioSelect} value={infoOptionsIndex}>
                    {radioOptions}
                </Radio.Group>
                <br /> <br />
                Additional Info:
                <TextArea value={additionalInfo} onChange={this.onAdditionalInfoChange} />
            </>
        )

        return (
            <>
                <ButtonModal
                    showModalButtonSize={"medium"}
                    showModalButtonDanger={true}
                    showModalButtonType={""}
                    showModalText={"Report Incorrect Information"}
                    modalTitle={"Report Incorrect Information"}
                    modalBody={reportIncorrectInfoModalBody}
                    submitText={"Send Report"}
                    onSubmit={this.sendReport}
                />
            </>
        )
    }

}

export default ReportIncorrectInfo
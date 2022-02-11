import React from 'react';
import PropTypes from "prop-types";
import ButtonModal from "./ButtonModal";
import { Radio, Input} from 'antd';
import ScholarshipsAPI from "../services/ScholarshipsAPI";
import { toastNotify } from "../models/Utils";
import {ScholarshipPropType} from "../models/Scholarship";

const { TextArea } = Input;
const incorrectInfoOptions = [
    {label: 'wrong_deadline', value: "Wrong deadline"},
    {label: 'no_longer_available', value: "No longer available"},
    {label: 'other', value: "Other"},
]

class ReportIncorrectInfo extends React.Component {

    constructor(props) {
        super(props);

        const { scholarship } = this.props;
        const defaultDeadline = scholarship.deadline.substring(0,10);
        // Since we're using an input date component, we only want the first 10 letters (ie yyyy-mm-dd).

        this.state = {
            infoOptionsLabel: 'wrong_deadline',
            additionalInfo: "",
            updatedDeadline: defaultDeadline,
        };
    }

    sendReport = () => {
        const { infoOptionsLabel, additionalInfo, updatedDeadline } = this.state;
        const { scholarship } = this.props;

        let postAdditionalInfo = additionalInfo;

        if (infoOptionsLabel === 'wrong_deadline' && updatedDeadline) {
            postAdditionalInfo = `New deadline suggested by user: ${updatedDeadline}. ${postAdditionalInfo}`
        }

        const postData = {
            "incorrect_info": findValueWithLabel(infoOptionsLabel),
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
            infoOptionsLabel: e.target.value,
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
        const { infoOptionsLabel, additionalInfo, updatedDeadline } = this.state;
        const { className } = this.props;

        const radioStyle = {
            display: 'block',
            lineHeight: '30px',
        };

        let wrongDeadlineExtraInfo = (
            <>
                <br />
                Select corrected deadline
                <input placeholder={"test"}
                       className="col-12 form-control floating__input"
                       name={"date"}
                       type={"date"}
                       onChange={this.onUpdatedDeadlineChange}
                       value={updatedDeadline}
                />
            </>
        )

        let radioOptions = incorrectInfoOptions.map((optionDict) => (
            <Radio style={radioStyle} value={optionDict.label} key={optionDict.label}>
                {optionDict.value}
                {infoOptionsLabel === 'wrong_deadline' && optionDict.label === infoOptionsLabel &&
                    wrongDeadlineExtraInfo
                }
            </Radio>
        ))

        let reportIncorrectInfoModalBody = (
            <>
                <Radio.Group onChange={this.onRadioSelect} value={infoOptionsLabel}>
                    {radioOptions}
                </Radio.Group>
                <br /> <br />
                Additional Info:
                <TextArea value={additionalInfo} onChange={this.onAdditionalInfoChange} />
            </>
        )

        return (
            <ButtonModal
                    className={className}
                    showModalButtonSize={"medium"}
                    showModalButtonDanger={true}
                    showModalButtonType={""}
                    showModalText={"Report Incorrect Information"}
                    modalTitle={"Report Incorrect Information"}
                    modalBody={reportIncorrectInfoModalBody}
                    submitText={"Send Report"}
                    onSubmit={this.sendReport}
                />
        )
    }

}

const findValueWithLabel = label => {
    for (const item of incorrectInfoOptions) {
        if (item.label === label) {
            return item.value;
        }
    }
}

ReportIncorrectInfo.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
    className: PropTypes.string,
}

export default ReportIncorrectInfo
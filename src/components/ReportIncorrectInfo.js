import React from 'react';
import ButtonModal from "./ButtonModal";
import { Radio, Input } from 'antd';


const incorrectInfoOptions = [
    "Wrong Deadline",
    "No longer available",
]

class ReportIncorrectInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            infoOptionsIndex: null,
            additionalInfo: "",
        };
    }

    sendReport = () => {

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

    render() {
        const { infoOptionsIndex, additionalInfo } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        let radioOptions = incorrectInfoOptions.map((optionText, index) => (
            <Radio style={radioStyle} value={index}>
                {optionText}
            </Radio>
        ))

        let reportIncorrectInfoModalBody = (
            <>
                <Radio.Group onChange={this.onRadioSelect} value={infoOptionsIndex}>
                    {radioOptions}
                </Radio.Group>
                <br /> <br />
                Additional Info:
                <Input value={additionalInfo} onChange={this.onAdditionalInfoChange} />
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
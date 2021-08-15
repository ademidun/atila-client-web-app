import React from "react";
import Environment from "../services/Environment";
import {google, office365, outlook, yahoo} from "calendar-link";
import {openInNewTab} from "../services/utils";
import {Radio, Space} from "antd";
import ButtonModal from "./ButtonModal";
import {ScholarshipPropType} from "../models/Scholarship";

class AddDeadlineToCalendar extends React.Component {
    constructor(props) {
        super(props);

        const { scholarship } = this.props;

        const event = {
            title: `Deadline for ${scholarship.name}`,
            description: `View Scholarship: ${Environment.clientUrl}/scholarship/${scholarship.slug}`,
            start: scholarship.deadline,
            end: scholarship.deadline,
        };

        const gCalUrl = google(event)
        const outlookUrl = outlook(event)
        const officeUrl = office365(event)
        const yahooUrl = yahoo(event)

        this.allCalendars = [
            {title: "Google Calendar", url: gCalUrl},
            {title: "Outlook Calendar", url: outlookUrl},
            {title: "Office365 Calendar", url: officeUrl},
            {title: "Yahoo Calendar", url: yahooUrl},
        ]

        this.state = {
            calendarIndex: 0,
        }
    }

    onRadioChange = event => {
        this.setState({calendarIndex: event.target.value})
    }

    saveDeadline = () => {
        const { calendarIndex } = this.state;
        const url = this.allCalendars[calendarIndex].url
        openInNewTab(url)
    }

    render() {
        const { calendarIndex } = this.state;

        const radioOptions = this.allCalendars.map((calendar, index) => (
            <Radio value={index}>{calendar.title}</Radio>
        ))

        const modalBody = (
            <div>
                <Radio.Group onChange={this.onRadioChange} value={calendarIndex}>
                    <Space direction="vertical">
                        {radioOptions}
                    </Space>
                </Radio.Group>
            </div>
        )

        return (
            <div>
                <ButtonModal showModalButtonType={""}
                             showModalButtonSize={"medium"}
                             showModalText={"Save Deadline To My Calendar"}
                             modalTitle={"Choose Calendar"}
                             modalBody={modalBody}
                             submitText={"Save Deadline"}
                             onSubmit={this.saveDeadline}
                />
            </div>
        )
    }
}

AddDeadlineToCalendar.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
};

export default AddDeadlineToCalendar;
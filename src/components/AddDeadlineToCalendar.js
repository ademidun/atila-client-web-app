import React from "react";
import Environment from "../services/Environment";
import {google, office365, outlook, yahoo} from "calendar-link";
import {Popover, Button} from "antd";
import {ScholarshipPropType} from "../models/Scholarship";

class AddDeadlineToCalendar extends React.Component {
    constructor(props) {
        super(props);

        const { scholarship } = this.props;

        const scholarshipUrl = `${Environment.clientUrl}/scholarship/${scholarship.slug}`;

        const event = {
            title: `Deadline for ${scholarship.name}`,
            description: `View Scholarship: ${scholarshipUrl}. \n \n ${scholarship.description}`,
            start: scholarship.deadline,
            end: scholarship.deadline,
            location: scholarshipUrl,
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
    }

    render() {

        let calendarOptions = this.allCalendars.map(calendar => (
            <>
                <a href={calendar.url} target="_blank" rel="noopener noreferrer">
                    {calendar.title}
                </a>
                <br />
            </>
        ))

        return (
            <div>
                <Popover trigger={"click"} title={<b>Choose Calendar</b>} content={calendarOptions} placement={"bottom"}>
                    <Button>Save Deadline To My Calendar</Button>
                </Popover>
            </div>
        )
    }
}

AddDeadlineToCalendar.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
};

export default AddDeadlineToCalendar;
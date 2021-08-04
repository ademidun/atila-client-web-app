import React from "react";
import PropTypes from 'prop-types';
import moment from "moment";
import {Tag, Button} from "antd";
import {ScholarshipPropType} from "../models/Scholarship";
import { google, outlook, office365, yahoo, ics } from "calendar-link";
import Environment from "../services/Environment";

const todayMoment = moment(Date.now());

function AddDeadlineToCalendar({scholarship}) {
    const event = {
        title: `Deadline for ${scholarship.name}`,
        description: `View Scholarship: ${Environment.clientUrl}/scholarship/${scholarship.slug}`,
        start: scholarship.deadline,
        end: scholarship.deadline,
    };

    const gCalUrl = google(event)
    console.log("HERE")
    console.log(ics(event))

    return (
        <div>
            <a href={gCalUrl} target={'_blank'} rel={'noopener noreferrer'}>
                <Button>Save Deadline to Google Calendar</Button>
            </a>
        </div>
    )
}


function ScholarshipDeadlineWithTags({scholarship, datePrefix, addDeadlineToCalendar}) {

    const { deadline, open_date, date_time_created } = scholarship;
    let tag = null;
    let tagPrefix = 'due';
    let color = null;

    let scholarshipDateMoment = moment(deadline);
    if (open_date && !open_date.includes("2022-12-31") && open_date > todayMoment.toISOString()) {
        scholarshipDateMoment = moment(open_date);
        tagPrefix = 'opens';
        datePrefix = 'Opens: ';
    }
    const daysFromDeadline = scholarshipDateMoment.diff(todayMoment, 'days');
    let scholarshipDateString = scholarshipDateMoment.format('dddd, MMMM DD, YYYY h:mm A');

    if (daysFromDeadline < 0) {
        color = 'volcano';
        tag = 'Expired'
    } else {
        if (daysFromDeadline < 7) {
            color = 'green';
        } else {
            color = 'geekblue';
        }
        tag = `${tagPrefix} ${scholarshipDateMoment.fromNow()}`;
    }


    if (deadline.includes("2022-01-01") && (!open_date || open_date.includes("2022-12-31"))) {
        scholarshipDateString = "TBA";
        tag = null
    }

    return (
        <React.Fragment>
            {datePrefix} {scholarshipDateString}{' '}
            {addDeadlineToCalendar && <AddDeadlineToCalendar scholarship={scholarship} />}
            {tag &&
            <React.Fragment>
            <Tag color={color} key={tag}>
                {tag.toUpperCase()}
            </Tag>
            </React.Fragment>
            }
            {date_time_created && dateAddedTag(date_time_created)}
        </React.Fragment>
    );
}

function dateAddedTag(date_time_created){

    let tag = null;
    let tagPrefix = 'Added';

    let scholarshipDateMoment = moment(date_time_created);
    const daysFromCreation = Math.abs(scholarshipDateMoment.diff(todayMoment, 'days'));

    if (daysFromCreation <= 7) {
        return (
            <React.Fragment>
                <Tag color="green" key={tag}>
                    {`${tagPrefix} ${scholarshipDateMoment.fromNow()}`.toUpperCase()}
                </Tag>
                <br/>
            </React.Fragment>
        )
    }

    return null


}

ScholarshipDeadlineWithTags.defaultProps = {
    datePrefix: 'Deadline: ',
    addDeadlineToCalendar: false,
};


ScholarshipDeadlineWithTags.propTypes = {
    datePrefix: PropTypes.string,
    scholarship: ScholarshipPropType.isRequired,
    addDeadlineToCalendar: PropTypes.bool,
};
export default ScholarshipDeadlineWithTags;
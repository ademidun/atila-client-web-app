import React from "react";
import PropTypes from 'prop-types';
import moment from "moment";
import {Tag} from "antd";
import {ScholarshipPropType} from "../models/Scholarship";
import AddDeadlineToCalendar from "./AddDeadlineToCalendar";

const todayMoment = moment(Date.now());

function ScholarshipDeadlineWithTags({scholarship, datePrefix, addDeadlineToCalendar}) {

    const { deadline, open_date, date_time_created, metadata } = scholarship;

    let showCalendar = addDeadlineToCalendar;

    let tag = null;
    let tagPrefix = 'due';
    let color = null;

    let scholarshipDateMoment = moment(deadline);
    if (open_date && open_date > todayMoment.toISOString() && metadata?.not_open_yet) {
        scholarshipDateMoment = moment(open_date);
        tagPrefix = 'opens';
        datePrefix = 'Opens: ';
        showCalendar = false;
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


    if (deadline >= ((new Date()).getFullYear() + 2) ) { // if deadline is 2 or more years away, assume it's TBA
        scholarshipDateString = "TBA";
        tag = null;
        showCalendar = false;
    }

    return (
        <React.Fragment>
            {datePrefix} {scholarshipDateString}{' '}
            {tag &&
            <React.Fragment>
            <Tag color={color} key={tag}>
                {tag.toUpperCase()}
            </Tag>
            </React.Fragment>
            }
            {showCalendar && <AddDeadlineToCalendar scholarship={scholarship} />}
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
import moment from "moment";
import React from "react";
import {Tag} from "antd";
import {ScholarshipPropType} from "../models/Scholarship";
const todayMoment = moment(Date.now());

function ScholarshipDeadlineWithTags({scholarship}) {

    const { deadline, open_date, metadata} = scholarship;
    let tag = null;
    let tagPrefix = 'due';
    let datePrefix = 'Deadline: ';
    let color = null;

    let scholarshipDateMoment = moment(deadline);
    console.log({open_date});
    console.log(' todayMoment.toISOString()',  todayMoment.toISOString());
    console.log('open_date > todayMoment.toISOString()', open_date > todayMoment.toISOString());
    if (open_date && metadata && metadata.not_open_yet && open_date > todayMoment.toISOString()) {
        scholarshipDateMoment = moment(open_date);
        tagPrefix = 'opens';
        datePrefix = 'Opens: ';
    }
    const daysFromDeadline = scholarshipDateMoment.diff(todayMoment, 'days');
    const scholarshipDateString = scholarshipDateMoment.format('dddd, MMMM DD, YYYY');

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

    if(!tag) {
        return null;
    }
    return (
        <React.Fragment>
            {datePrefix} {scholarshipDateString}{' '}
            {tag &&
            <Tag color={color} key={tag}>
                {tag.toUpperCase()}
            </Tag>}
        </React.Fragment>
    );
}
ScholarshipDeadlineWithTags.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
};
export default ScholarshipDeadlineWithTags;
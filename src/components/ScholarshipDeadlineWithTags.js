import React from "react";
import PropTypes from 'prop-types';
import moment from "moment";
import {Tag} from "antd";
import {ScholarshipPropType} from "../models/Scholarship";
const todayMoment = moment(Date.now());

function ScholarshipDeadlineWithTags({scholarship, datePrefix}) {

    const { deadline, open_date} = scholarship;
    let tag = null;
    let tagPrefix = 'due';
    let color = null;

    let scholarshipDateMoment = moment(deadline);
    if (open_date && open_date > todayMoment.toISOString()) {
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

ScholarshipDeadlineWithTags.defaultProps = {
    datePrefix: 'Deadline: ',
};


ScholarshipDeadlineWithTags.propTypes = {
    datePrefix: PropTypes.string,
    scholarship: ScholarshipPropType.isRequired,
};
export default ScholarshipDeadlineWithTags;
import React from "react";
import PropTypes from 'prop-types';
import moment from "moment";
import {Tag} from "antd";
import {ScholarshipPropType} from "../models/Scholarship";
const todayMoment = moment(Date.now());

function ScholarshipDeadlineWithTags({scholarship, datePrefix}) {

    const { deadline, open_date, metadata, date_time_created} = scholarship;
    let tag = null;
    let tagPrefix = 'due';
    let color = null;

    let scholarshipDateMoment = moment(deadline);
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
    return (
        <React.Fragment>
            {datePrefix} {scholarshipDateString}{' '}
            {tag &&
            <React.Fragment>
            <br/>
            <Tag color={color} key={tag}>
                {tag.toUpperCase()}
            </Tag>
            </React.Fragment>
            }
            {dateAddedTag(date_time_created)}
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
};


ScholarshipDeadlineWithTags.propTypes = {
    datePrefix: PropTypes.string,
    scholarship: ScholarshipPropType.isRequired,
};
export default ScholarshipDeadlineWithTags;
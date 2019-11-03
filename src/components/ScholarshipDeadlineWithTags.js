import moment from "moment";
import React from "react";
import {Tag} from "antd";
const todayMoment = moment(Date.now());

function ScholarshipDeadlineWithTags({deadline}) {

    let tag = null;
    let color = null;
    const deadlineMoment = moment(deadline);
    const daysFromDeadline = deadlineMoment.diff(todayMoment, 'days');
    const deadlineString = moment(deadline).format('dddd, MMMM DD, YYYY');

    if (daysFromDeadline < 0) {
        color = 'volcano';
        tag = 'Expired'
    } else {
        if (daysFromDeadline < 7) {
            color = 'green';
        } else {
            color = 'geekblue';
        }
        tag = `due ${moment(deadline).fromNow()}`;
    }

    if(!tag) {
        return null;
    }
    return (
        <React.Fragment>
            {deadlineString}{' '}
            {tag &&
            <Tag color={color} key={tag}>
                {tag.toUpperCase()}
            </Tag>}
        </React.Fragment>
    );
}

export default ScholarshipDeadlineWithTags;
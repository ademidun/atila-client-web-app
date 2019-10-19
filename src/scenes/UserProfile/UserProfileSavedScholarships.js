import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import {Button, Table, Divider, Tag} from "antd";
import PropTypes from "prop-types";
import {Link, withRouter} from "react-router-dom";
import moment from "moment";



const todayDate = new Date().toISOString();
const todayMoment = moment(Date.now());

class UserProfileViewSavedScholarships extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarships: null,
            filteredScholarships: null,
            showExpiredScholarships: false,
        }
    }

    componentDidMount() {

        const { userProfile: {user : userId} } = this.props;

        UserProfileAPI.getUserContent(userId, 'scholarships')
            .then(res => {
                const scholarships =  res.data.scholarships;
                this.setState({scholarships}, () => {
                    this.toggleShowExpiredScholarships(false)
                });
            });
    }

    toggleShowExpiredScholarships(showExpiredScholarships) {

        const { scholarships } = this.state;
        this.setState({showExpiredScholarships});
        let filteredScholarships = [];
        if (showExpiredScholarships) {
            filteredScholarships = scholarships.slice();
        } else {
            filteredScholarships = scholarships.filter( scholarship =>
                scholarship.deadline > todayDate );

        }

        this.setState({filteredScholarships});

    }


    render() {

        const {  filteredScholarships, showExpiredScholarships } = this.state;

        if (!filteredScholarships) {
            return (<Loading title={`Loading Scholarships`} className='mt-3' />)
        }
        return (<React.Fragment>
            <Button type="primary"
                    className="mt-3"
                    onClick={()=>{
                        this.toggleShowExpiredScholarships(!showExpiredScholarships)
                    }}>
                {showExpiredScholarships? 'Hide' : 'Show'} Expired Scholarships
            </Button>
            <SavedScholarshipsTable scholarships={filteredScholarships} />
        </React.Fragment>)
    }


}

function SavedScholarshipsTable({ scholarships }){

    const columns = [
        {
            title: 'Row',
            key: 'row',
            render: (text, record, index) => (index+1)
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`/scholarship${record.slug}`}>{text}</Link>
            ),
        },
        {
            title: 'description',
            dataIndex: 'description',
            key: 'description',
            render: text => (`${text.substr(0, 140)}...`),
        },
        {
            title: 'Deadline',
            key: 'deadline',
            dataIndex: 'deadline',
            render: deadline => {
                let tag = null;
                let color = null;
                const deadlineMoment = moment(deadline);
                const daysFromDeadline = deadlineMoment.diff(todayMoment, 'days');
                const deadlineString = moment(deadline).format('dddd, MMMM DD, YYYY');

                console.log({dayFromDeadline: daysFromDeadline});

                if (daysFromDeadline < 0) {
                    color = 'volcano';
                    tag = 'Expired'
                } else if (deadline < 7) {
                    color = 'green';
                    tag = 'due this week'
                } else {
                    color = 'geekblue'
                    tag = `due ${moment(deadline).fromNow()}`;
                }

                if(!tag) {
                    return null;
                }
                return (
                    <React.Fragment>
                        {deadlineString} <br />
                        {tag &&
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>}
                    </React.Fragment>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
        <Link to={`/scholarship${record.slug}`}>Scholarship Details</Link>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
            ),
        },
    ];

    return (<Table columns={columns} dataSource={scholarships} />)
}

UserProfileViewSavedScholarships.defaultProps = {
};

UserProfileViewSavedScholarships.propTypes = {
    userProfile: PropTypes.shape({}).isRequired,
};
export default withRouter(UserProfileViewSavedScholarships);
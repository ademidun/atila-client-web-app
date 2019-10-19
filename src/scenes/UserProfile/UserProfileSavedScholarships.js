import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import {Button, Table, Tag} from "antd";
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

    toggleShowExpiredScholarships = (showExpiredScholarships) => {

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

    removeSavedScholarship(scholarshipId) {
        let { scholarships } = this.state;
        scholarships = scholarships.filter( scholarship =>
            scholarship.id != scholarshipId );

        this.setState({filteredScholarships: scholarships});
        this.setState({scholarships});
    }

    render() {

        const {  filteredScholarships, showExpiredScholarships } = this.state;

        if (!filteredScholarships) {
            return (<Loading title={`Loading Scholarships`} className='mt-3' />)
        }
        return (<React.Fragment>
            <Button type="primary"
                    className="my-3"
                    onClick={()=>{
                        this.toggleShowExpiredScholarships(!showExpiredScholarships)
                    }}>
                {showExpiredScholarships? 'Hide' : 'Show'} Expired Scholarships
            </Button>
            <SavedScholarshipsTable scholarships={filteredScholarships}
                                    removeSavedScholarship={this.removeSavedScholarship.bind(this)}  />
        </React.Fragment>)
    }


}

function SavedScholarshipsTable({ scholarships, removeSavedScholarship }){

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`/scholarship/${record.slug}`}>{text}</Link>
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
            title: 'Remove',
            key: 'action',
            render: (text, record) => (
                <button className="btn btn-link my-3"
                        onClick={()=>{
                            removeSavedScholarship(record.id);
                        }}>
                    Remove
                </button>
            ),
        },
    ];

    return (<Table columns={columns} dataSource={scholarships} rowKey="id" />)
}

UserProfileViewSavedScholarships.defaultProps = {
};

UserProfileViewSavedScholarships.propTypes = {
    userProfile: PropTypes.shape({}).isRequired,
};
export default withRouter(UserProfileViewSavedScholarships);
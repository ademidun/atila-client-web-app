import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import {Button, Table} from "antd";
import {Link} from "react-router-dom";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import {connect} from "react-redux";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";

const todayDate = new Date().toISOString();

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
        let { scholarships, showExpiredScholarships } = this.state;
        const { userProfile: {user : userId}, updateLoggedInUserProfile } = this.props;
        scholarships = scholarships.filter( scholarship => scholarship.id !== scholarshipId );

        UserProfileAPI.removeSavedScholarship(userId, scholarshipId)
            .then(res => {
                updateLoggedInUserProfile(res.data.user_profile);
            });

        this.setState({scholarships}, () => {
            this.toggleShowExpiredScholarships(showExpiredScholarships);
        });

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
            render: deadline => (<ScholarshipDeadlineWithTags deadline={deadline} />),
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

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileViewSavedScholarships);
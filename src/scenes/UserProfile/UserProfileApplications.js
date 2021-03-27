import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import {Table} from "antd";
import {Link} from "react-router-dom";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import {connect} from "react-redux";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";
import { ApplicationPreview, ApplicationsSearch } from '../Application/ApplicationsSearch';

class UserProfileApplications extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            applications: null,
            isLoading: false,
        }
    }

    componentDidMount() {

        const { userProfile: {user : userId} } = this.props;
        this.setState({isLoading: true});
        UserProfileAPI.getUserContent(userId, 'applications')
            .then(res => {
                const applications =  res.data.applications;
                this.setState({applications});
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    }

    render() {

        const {  applications, isLoading } = this.state;

        if (isLoading) {
            return (<Loading title={`Loading Applications`} className='mt-3' />)
        }
        return (<React.Fragment>
            <ApplicationsTable applications={applications} />
        </React.Fragment>)
    }


}

function ApplicationsTable({ applications }){

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'applicationID',
            render: (text, application) => (
                <>
                    <Link to={`/application/${application.id}`}>View Application <br/>({text})</Link>
                    <hr/>
                    <ApplicationPreview application={application} searchTerm={""} />
                </>
            ),
        },
        {
            title: 'Scholarship',
            dataIndex: ['scholarship', 'name'],
            key: 'description',
            render: (text, application) => (
                <Link to={`/scholarship/${application.scholarship.slug}`}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Deadline',
            key: 'deadline',
            dataIndex: 'deadline',
            render: (deadline, application) => (<ScholarshipDeadlineWithTags scholarship={application.scholarship}
                                                                             datePrefix="" />),
        }
    ];

    return (
    <>
        <ApplicationsSearch applications={applications} updateSearch={(filtered, searchTerm) => {}} />
        <Table columns={columns} dataSource={applications} rowKey="id" />
    </>)
}

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApplications);
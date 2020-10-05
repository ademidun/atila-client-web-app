import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import {Table} from "antd";
import {Link} from "react-router-dom";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import {connect} from "react-redux";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";

class UserProfileSponsoredScholarships extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            createdScholarships: null,
            isLoading: false,
        }
    }

    componentDidMount() {

        const { userProfile: {user : userId} } = this.props;
        this.setState({isLoading: true});
        UserProfileAPI.getUserContent(userId, 'created_scholarships')
            .then(res => {
                const createdScholarships =  res.data.created_scholarships;
                this.setState({createdScholarships});
                console.log("created: ", createdScholarships)
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    }

    render() {

        const {  createdScholarships, isLoading } = this.state;

        if (isLoading) {
            return (<Loading title={`Loading Scholarships`} className='mt-3' />)
        }
        return (<React.Fragment>
            <CreatedScholarshipsTable createdScholarships={createdScholarships}/>
        </React.Fragment>)
    }


}

function CreatedScholarshipsTable({ createdScholarships }){

    const columns = [
        {
            title: 'Scholarship',
            dataIndex: 'name',
            key: '1',
            render: (text, scholarship) => (
                <Link to={`/scholarship/${scholarship.slug}`}>
                    {`${text.substr(0, 140)}...`}
                </Link>
            ),
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: '2',
            render: (deadline, scholarship) => (<ScholarshipDeadlineWithTags scholarship={scholarship}
                                                                             datePrefix="" />),
        },
        {
            title: '',
            dataIndex: '',
            key: '3',
            render: () => (
                <Link to={`/`} className="btn btn-outline-primary">
                    Manage
                </Link>
            )
        }
    ];

    return (<Table columns={columns} dataSource={createdScholarships} rowKey="id" />)
}

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileSponsoredScholarships);
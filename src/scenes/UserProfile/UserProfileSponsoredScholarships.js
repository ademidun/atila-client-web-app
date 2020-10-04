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
            sponsoredScholarships: null,
            isLoading: false,
        }
    }

    componentDidMount() {

        const { userProfile: {user : userId} } = this.props;
        this.setState({isLoading: true});
        UserProfileAPI.getUserContent(userId, 'sponsored_scholarships')
            .then(res => {
                const sponsoredScholarships =  res.data.scholarships;
                this.setState({sponsoredScholarships});
                console.log("sponsored: ", sponsoredScholarships)
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    }

    render() {

        const {  sponsoredScholarships, isLoading } = this.state;

        if (isLoading) {
            return (<Loading title={`Loading Scholarships`} className='mt-3' />)
        }
        return (<React.Fragment>
            <SponsoredScholarshipsTable sponsoredScholarships={sponsoredScholarships} />
        </React.Fragment>)
    }


}

function SponsoredScholarshipsTable({ sponsoredScholarships }){
    const columns = [
        {
            title: 'Scholarship',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`/scholarship/${record.slug}`}>{text}</Link>
            ),
        },
        {
            title: 'Deadline',
            key: 'deadline',
            dataIndex: 'deadline',
            render: (deadline, scholarship) => (<ScholarshipDeadlineWithTags scholarship={scholarship} datePrefix="" />),
        },
        {
            title: '',
            key: '',
            dataIndex: '',
            render: () => (
                <Link to={`/`} className="btn btn-outline-primary">
                    Manage
                </Link>
            ),
        }
    ];

    return (<Table columns={columns} dataSource={sponsoredScholarships} rowKey="id" />)
}

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileSponsoredScholarships);
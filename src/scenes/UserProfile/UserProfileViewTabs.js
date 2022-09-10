import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Tab, Tabs} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import UserProfileAPI from '../../services/UserProfileAPI';
import ContentCard from '../../components/ContentCard';
import {genericItemTransform, truncate} from '../../services/utils';
import Loading from '../../components/Loading';
import UserProfileEdit from './UserProfileEdit';
import UserProfileViewSavedScholarships from './UserProfileSavedScholarships';
import {RESERVED_USERNAMES} from "../../models/Constants";
import UserProfileApplications from "./UserProfileApplications";
import UserProfileCreatedScholarships from "./UserProfileCreatedScholarships";
import {Link} from "react-router-dom";
import UserProfileAdmin from './UserProfileAdmin';
import UserProfileReferralManagement from './UserProfileReferralManagement';
import ConnectWallet from '../../components/Crypto/ConnectWallet';
import UserProfileMentorship from './UserProfileMentorship';

class UserProfileViewTabs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            blogs: null,
            essays: null,
            scholarships: null,
            contributions: null,
        }
    }

    componentDidMount() {

        const { userProfile: {user : userId} } = this.props;

        UserProfileAPI.getUserContent(userId, 'blogs')
            .then(res => {
                this.setState({blogs: res.data.blogs });
            });
        UserProfileAPI.getUserContent(userId, 'essays')
            .then(res => {
                this.setState({essays: res.data.essays });
            });
        UserProfileAPI.getUserContent(userId, 'contributions')
            .then(res => {
                this.setState({contributions: res.data.contributions });
            });
    }

    render() {

        const { blogs, essays, contributions } = this.state;
        const { isProfileEditable, loggedInUserProfile, userProfile: {user : userIdInView} } = this.props;
        let { match : { params : { tab, username }} } = this.props;
        let defaultActiveKey = isProfileEditable ? 'edit' : 'mentorship';

        if (RESERVED_USERNAMES.includes(username)) {
            defaultActiveKey = username;
        }

        if (!isProfileEditable && blogs && blogs.length === 0 && essays && essays.length > 0 ) {
            defaultActiveKey = 'essays';
        }

        if(tab) {
            defaultActiveKey = tab;
            let validTabs = ['essays', 'blogs'];
            if (loggedInUserProfile && loggedInUserProfile.is_atila_admin) {
                validTabs.push("admin");
            }
            if (!validTabs.includes(tab) && !isProfileEditable) {
                defaultActiveKey = 'blogs';
            }
        }

        return (
            <div className='mt-3'>
                <Tabs defaultActiveKey={defaultActiveKey} transition={false} id="UserProfileViewTabs">
                    { loggedInUserProfile && loggedInUserProfile.is_atila_admin &&
                        <Tab eventKey='admin' title='Admin'>
                            <UserProfileAdmin username={username} />
                        </Tab>
                    }
                    {isProfileEditable &&
                    <Tab eventKey='edit' title='Edit Profile'>
                        <UserProfileEdit />
                    </Tab>
                    }
                    {isProfileEditable &&
                    <Tab eventKey='mentorship' title='Mentorship'>
                        <UserProfileMentorship userIdInView={userIdInView} />
                    </Tab>
                    }
                    {loggedInUserProfile && loggedInUserProfile.is_atila_admin &&
                        <Tab eventKey='wallet' title='Wallet'>
                            <ConnectWallet /> 
                        </Tab>
                    }
                    {isProfileEditable && 
                        <Tab eventKey='referrals' title='Referrals'>
                            <UserProfileReferralManagement /> 
                        </Tab>
                    }       
                    {isProfileEditable &&
                    <Tab eventKey='applications' title='My Applications'>
                        <UserProfileApplications />
                    </Tab>
                    }
                    {isProfileEditable &&
                    <Tab eventKey='scholarships' title='Saved Scholarships'>
                        <UserProfileViewSavedScholarships />
                    </Tab>
                    }
                    {isProfileEditable &&
                    <Tab eventKey='manage-scholarships' title='Manage Scholarships'>
                        <UserProfileCreatedScholarships />
                    </Tab>
                    }
                    <Tab eventKey='blogs' title='Blogs'>
                        <TabItemContentList
                            contentList={blogs}
                            contentType={'blog'}/>
                    </Tab>
                    <Tab eventKey='essays' title='Essays'>
                        <TabItemContentList
                            contentList={essays}
                            contentType={'essay'}/>
                    </Tab>
                    <Tab eventKey='contributions' title='Contributions'>
                        <TabItemContentList
                            contentList={contributions}
                            contentType={'contribution'}
                            isProfileEditable={isProfileEditable}/>
                    </Tab>
                </Tabs>
            </div>
        )
    }


}

function TabItemContentList({ contentList, contentType, isProfileEditable }){

    if (!contentList) {
        return (<Loading title={`Loading ${contentType}s`} className='mt-3' />)
    }
    return (<div className='col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-3'>
        {contentList.map( content => {

            if (contentType === "contribution") {

                const { scholarship } = content;
                return (
                    <div className="col-12 card text-center mb-3 py-3" key={`${content.scholarship.id}`}>
                        {content.is_anonymous &&
                        <p className="text-muted">This scholarship ws made anonymously, only you can see this scholarship. </p>
                        }
                        <h3>
                            <Link  title={scholarship.name} to={`/scholarship/${scholarship.slug}`}>
                                {truncate(scholarship.name)}
                            </Link>
                        </h3>
                        <div>
                            <img src={scholarship.img_url}
                                 alt={scholarship.name}
                                 className="rounded-circle shadow my-3 square-icon mr-3"/>

                            <img src="https://freeiconshop.com/wp-content/uploads/edd/plus-flat.png" alt="Plus sign" width="50px" />
                            <img src={content.profile_pic_url}
                                 alt={content.first_name}
                                 style={{width: "150px"}}
                                 className="rounded-circle shadow my-3 square-icon ml-3"/>
                        </div>
                        {isProfileEditable && content.funding_confirmation_image_url &&

                        <div className="col-12">
                            <p className="text-muted">Only you can see the image below: </p>
                            <img src={content.funding_confirmation_image_url}
                                 style={{width: "100%"}} alt={`Scholarship Contribution confirmation for ${content.first_name}`} />
                        </div>

                        }
                    </div>
                )
            } else {
                return (
                    <ContentCard key={content.id} content={genericItemTransform(content)}
                                 className='col-12 mb-3'
                                 hideImage={contentType==='essay'}
                    />)
            }
        }

        )}
    </div>)
}
UserProfileViewTabs.defaultProps = {
    isProfileEditable: false,
};

UserProfileViewTabs.propTypes = {
    userProfile: PropTypes.shape({}).isRequired,
    isProfileEditable: PropTypes.bool
};

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(UserProfileViewTabs));
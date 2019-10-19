import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs} from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import UserProfileAPI from '../../services/UserProfileAPI';
import ContentCard from '../../components/ContentCard';
import {genericItemTransform} from '../../services/utils';
import Loading from '../../components/Loading';
import UserProfileEdit from './UserProfileEdit';
import UserProfileViewSavedScholarships from './UserProfileSavedScholarships';

class UserProfileViewTabs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            blogs: null,
            essays: null,
            scholarships: null,
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
    }

    render() {

        const { blogs, essays } = this.state;
        const { isProfileEditable, userProfile } = this.props;
        const { match : { params : { tab }} } = this.props;
        let defaultActiveKey = isProfileEditable ? 'scholarships' : 'blogs';

        if (!isProfileEditable && blogs && blogs.length === 0 && essays && essays.length > 0 ) {
            defaultActiveKey = 'essays';
        }

        if(tab) {
            defaultActiveKey = tab;
            if (tab ==='edit' && !isProfileEditable) {
                defaultActiveKey = 'blogs';
            }
        }


        return (
            <div className='mt-3'>
                <Tabs defaultActiveKey={defaultActiveKey} transition={false}>
                    {isProfileEditable &&
                    <Tab eventKey='scholarships' title='Saved Scholarships'>
                        <UserProfileViewSavedScholarships userProfile={userProfile}/>
                    </Tab>
                    }
                    {isProfileEditable &&
                    <Tab eventKey='edit' title='Edit Profile'>
                        <UserProfileEdit />
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
                </Tabs>
            </div>
        )
    }


}

function TabItemContentList({ contentList, contentType }){

    if (!contentList) {
        return (<Loading title={`Loading ${contentType}s`} className='mt-3' />)
    }
    return (<div className='col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-3'>
        {contentList.map( content =>
            <ContentCard key={content.id} content={genericItemTransform(content)}
                         className='col-12 mb-3'
                         hideImage={contentType==='essay'}
            />

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
export default withRouter(UserProfileViewTabs);
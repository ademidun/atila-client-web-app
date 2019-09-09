import React from 'react';
import PropTypes from 'prop-types';
import {Nav, Tab, Tabs} from "react-bootstrap";
import UserProfileAPI from "../../services/UserProfileAPI";
import ContentCard from "../../components/ContentCard";
import {genericItemTransform} from "../../services/utils";
import Loading from "../../components/Loading";

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
                console.log(res);
                console.log({ res });
                this.setState({blogs: res.data.blogs });
            });
        UserProfileAPI.getUserContent(userId, 'essays')
            .then(res => {
                console.log(res);
                console.log({ res });
                this.setState({essays: res.data.essays });
            });
        UserProfileAPI.getUserContent(userId, 'scholarships')
            .then(res => {
                console.log(res);
                console.log({ res });
                this.setState({scholarships: res.data.scholarships });
            });
    }

    setActiveNav = (activeNavType, event) => {
        console.log({ activeNavType, event });
        this.setState({ activeNavType })
    };

    render() {

        const { blogs, essays } = this.state;

        return (
            <div className="mt-3">
            <Tabs defaultActiveKey="blogs" transition={false}>
                <Tab eventKey="blogs" title="Blogs">
                    <TabItemContentList
                        contentList={blogs}
                        contentType={'blog'}/>
                </Tab>
                <Tab eventKey="essays" title="Essays">
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
        return (<Loading />)
    }
    return (<div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        {contentList.map( content =>
            <ContentCard key={content.id} content={genericItemTransform(content)}
                         className="col-12 mb-3"
                         hideImage={contentType==='essay'}
            />

        )}
    </div>)
}

UserProfileViewTabs.propTypes = {
    userProfile: PropTypes.shape({}).isRequired
};
export default UserProfileViewTabs
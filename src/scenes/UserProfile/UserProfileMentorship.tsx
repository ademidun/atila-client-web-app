import React from 'react';
import {connect} from "react-redux";
import {Tab, Tabs} from 'react-bootstrap';
import MentorshipSessions from '../../components/Mentorship/MentorshipSessions';
import MentorProfileEdit from '../../components/Mentorship/Mentor/MentorProfileEdit';
import MentorProfileView from '../../components/Mentorship/Mentor/MentorProfileView';
import { UserProfile } from '../../models/UserProfile.class';


export interface UserProfileMentorshipPropTypes {
  userProfileLoggedIn?: UserProfile,
  userIdInView: number,
}

function UserProfileMentorship(props: UserProfileMentorshipPropTypes) {


  const { userProfileLoggedIn, userIdInView } = props;
  
  return (
    <div>
      {userProfileLoggedIn && userIdInView === userProfileLoggedIn.user ?
        <Tabs defaultActiveKey="sessions" transition={false} id="UserProfileViewTabs">
          <Tab eventKey='sessions' title='Sessions'>
              <MentorshipSessions />
          </Tab>
          <Tab eventKey='edit' title='Edit Mentor Profile'>
              <MentorProfileEdit />
          </Tab>
            <Tab eventKey='view' title='View Mentor Profile'>
                <MentorProfileView userId={userIdInView} />
            </Tab>
        </Tabs>
        :
        <MentorProfileView userId={userIdInView} />
      }
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileMentorship);
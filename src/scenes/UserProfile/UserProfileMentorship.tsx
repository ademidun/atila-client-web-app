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
        <Tabs defaultActiveKey={userProfileLoggedIn ? "sessions" : "view"} transition={false} id="UserProfileViewTabs">
            {userProfileLoggedIn && 
              <Tab eventKey='edit' title='Edit Mentor Profile'>
                  <MentorProfileEdit />
              </Tab>
            }
            {userProfileLoggedIn && 
              <Tab eventKey='sessions' title='Sessions'>
                  <MentorshipSessions />
              </Tab>
            }
            <Tab eventKey='view' title='View Mentor Profile'>
                <MentorProfileView userId={userIdInView} />
            </Tab>
        </Tabs>

    </div>
  )
}

const mapStateToProps = (state: any) => {
  return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileMentorship);
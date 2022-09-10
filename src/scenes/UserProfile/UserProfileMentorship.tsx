import React from 'react'
import {Tab, Tabs} from 'react-bootstrap';
import MentorshipSessions from '../../components/Mentorship/MentorshipSessions';
import MentorProfileEdit from './MentorProfileEdit';

function UserProfileMentorship() {
  return (
    <div>
        <Tabs defaultActiveKey={"sessions"} transition={false} id="UserProfileViewTabs">
            <Tab eventKey='sessions' title='Sessions'>
                <MentorshipSessions />
            </Tab>
            <Tab eventKey='edit' title='Edit Mentor Profile'>
                <MentorProfileEdit />
            </Tab>
        </Tabs>

    </div>
  )
}

export default UserProfileMentorship
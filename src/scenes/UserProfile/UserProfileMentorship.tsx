import React from 'react'
import {Tab, Tabs} from 'react-bootstrap';
import MentorSessions from '../../components/Mentor/MentorSessions';
import MentorProfileEdit from './MentorProfileEdit';

function UserProfileMentorship() {
  return (
    <div>
        <Tabs defaultActiveKey={"sessions"} transition={false} id="UserProfileViewTabs">
            <Tab eventKey='sessions' title='Sessions'>
                <MentorSessions />
            </Tab>
            <Tab eventKey='edit' title='Edit Mentor Profile'>
                <MentorProfileEdit />
            </Tab>
        </Tabs>

    </div>
  )
}

export default UserProfileMentorship
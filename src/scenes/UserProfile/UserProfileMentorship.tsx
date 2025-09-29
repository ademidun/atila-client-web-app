import React, { useCallback, useEffect, useState } from 'react';
import {connect} from "react-redux";
import { Tabs, Tab } from 'react-bootstrap';
import MentorProfileEdit from '../../components/Mentorship/Mentor/MentorProfileEdit';
import MentorProfileView from '../../components/Mentorship/Mentor/MentorProfileView';
import { UserProfile } from '../../models/UserProfile.class';
import { Mentor } from '../../models/Mentor';
import UserProfileAPI from '../../services/UserProfileAPI';
import { getErrorMessage } from '../../services/utils';
import Loading from '../../components/Loading';

export interface UserProfileMentorshipPropTypes {
  userProfileLoggedIn?: UserProfile,
  userIdInView: number,
}

const UserProfileMentorship: React.FC<UserProfileMentorshipPropTypes> = ({ userProfileLoggedIn, userIdInView }) => {
  const [mentor, setMentor] = useState<Mentor | undefined>(undefined);
  const [loadingUI, setLoadingUI] = useState({message: "", type: ""});
  const [activeKey, setActiveKey] = useState('edit');

  const loadMentor = useCallback(() => {
    if (!userIdInView) return;
    
    setLoadingUI({message: "Loading Mentor profile", type: "info"});
    UserProfileAPI.getUserContent(userIdInView, "mentor")
    .then((res: any) => {
        const { data } = res;
        setMentor(data.mentor);
    })
    .catch(error => {
        console.log({error});
        setLoadingUI({message: getErrorMessage(error), type: "error"});
    })
    .finally(() => {
        setLoadingUI({message: "", type: ""});
    });
  }, [userIdInView]);

  useEffect(() => {
    loadMentor();
  }, [loadMentor]);
  
  return (
    <div>
      {userProfileLoggedIn && (userIdInView === userProfileLoggedIn.user || userProfileLoggedIn.is_atila_admin) ? (
        <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k || 'edit')} transition={false} id="UserProfileViewTabs">
          <Tab eventKey='edit' title='Edit Mentor Profile'>
              <MentorProfileEdit />
          </Tab>
          <Tab eventKey='view' title='View Mentor Profile'>
              {mentor && <MentorProfileView mentor={mentor} />}
          </Tab>
        </Tabs>
      ) : (
        <>
          {mentor && <MentorProfileView mentor={mentor} />}
        </>
      )}

      {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  userProfileLoggedIn: state.data.user.loggedInUserProfile
});

export default connect(mapStateToProps)(UserProfileMentorship);
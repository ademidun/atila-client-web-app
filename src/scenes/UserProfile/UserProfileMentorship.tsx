import React, { useCallback, useEffect, useState } from 'react';
import {connect} from "react-redux";
import {Tab, Tabs} from 'react-bootstrap';
import MentorshipSessions from '../../components/Mentorship/MentorshipSessions';
import MentorProfileEdit from '../../components/Mentorship/Mentor/MentorProfileEdit';
import MentorProfileView from '../../components/Mentorship/Mentor/MentorProfileView';
import { UserProfile } from '../../models/UserProfile.class';
import { Mentor } from '../../models/Mentor';
import UserProfileAPI from '../../services/UserProfileAPI';
import { getErrorMessage } from '../../services/utils';
import Loading from '../../components/Loading';
import MentorScheduleEdit from '../../components/Mentorship/Mentor/MentorScheduleEdit';


export interface UserProfileMentorshipPropTypes {
  userProfileLoggedIn?: UserProfile,
  userIdInView: number,
}

function UserProfileMentorship(props: UserProfileMentorshipPropTypes) {


  const { userProfileLoggedIn, userIdInView } = props;

  const [mentor, setMentor] = useState<Mentor>();
  const [loadingUI, setLoadingUI] = useState({message: "", type: ""});

  const loadMentor = useCallback(
      () => {
  
      setLoadingUI({message: "Loading Mentor profile", type: "info"});
      UserProfileAPI.getUserContent(userIdInView, "mentor")
      .then((res: any) => {
          const { data } = res;
          console.log("loadMentor", {res});
          setMentor(data.mentor);
          console.log("loadMentor", {res});
      })
      .catch(error => {
          console.log({error});
          setLoadingUI({message: getErrorMessage(error), type: "error"});
      })
      .finally(()=> {
          setLoadingUI({message: "", type: ""});
      })
        return ;// code that references a prop
      },
      [userIdInView]
    );
  useEffect(() => {
      if (userIdInView) {
          loadMentor();
      }
      
  }, [loadMentor, userIdInView]);
  
  return (
    <div>
      {userProfileLoggedIn && ( userIdInView === userProfileLoggedIn.user || userProfileLoggedIn.is_atila_admin)?
        <Tabs defaultActiveKey="edit" transition={false} id="UserProfileViewTabs">
          <Tab eventKey='edit' title='Edit Mentor Profile'>
              <MentorProfileEdit />
          </Tab>
            <Tab eventKey='schedule' title='Edit Mentor Schedule'>
                {mentor && <MentorScheduleEdit mentor={mentor} />}
            </Tab>
          <Tab eventKey='sessions' title='Sessions'>
              <MentorshipSessions />
          </Tab>
            <Tab eventKey='view' title='View Mentor Profile'>
                {mentor && <MentorProfileView mentor={mentor} />}
            </Tab>
        </Tabs>
        :
        <>
          {mentor && <MentorProfileView mentor={mentor} />}
        </>
      }


      {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileMentorship);
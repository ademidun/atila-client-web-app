import React, { useCallback, useEffect, useState } from 'react';
import {connect} from "react-redux";
import {Tab, Tabs} from 'react-bootstrap';
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

// Convert to class component to fix React 18 compatibility issues with Tab components
class UserProfileMentorship extends React.Component<UserProfileMentorshipPropTypes> {
  state = {
    mentor: undefined as Mentor | undefined,
    loadingUI: {message: "", type: ""}
  };

  componentDidMount() {
    const { userIdInView } = this.props;
    if (userIdInView) {
      this.loadMentor();
    }
  }

  componentDidUpdate(prevProps: UserProfileMentorshipPropTypes) {
    if (prevProps.userIdInView !== this.props.userIdInView && this.props.userIdInView) {
      this.loadMentor();
    }
  }

  loadMentor = () => {
    const { userIdInView } = this.props;
    
    this.setState({loadingUI: {message: "Loading Mentor profile", type: "info"}});
    UserProfileAPI.getUserContent(userIdInView, "mentor")
    .then((res: any) => {
        const { data } = res;
        this.setState({mentor: data.mentor});
    })
    .catch(error => {
        console.log({error});
        this.setState({loadingUI: {message: getErrorMessage(error), type: "error"}});
    })
    .finally(() => {
        this.setState({loadingUI: {message: "", type: ""}});
    });
  };
  
  render() {
    const { userProfileLoggedIn, userIdInView } = this.props;
    const { mentor, loadingUI } = this.state;
    
    return (
      <div>
        {userProfileLoggedIn && (userIdInView === userProfileLoggedIn.user || userProfileLoggedIn.is_atila_admin) ? (
          <Tabs defaultActiveKey="edit" transition={false} id="UserProfileViewTabs">
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
}

const mapStateToProps = (state: any) => {
  return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileMentorship);
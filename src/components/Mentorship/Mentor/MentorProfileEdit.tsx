import { Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import {connect} from "react-redux";
import FormDynamic from '../../Form/FormDynamic';
import Loading from '../../Loading';
import { Mentor, mentorProfileFormConfig } from '../../../models/Mentor';
import { UserProfile } from '../../../models/UserProfile.class';
import MentorshipAPI from '../../../services/MentorshipAPI';
import UserProfileAPI from '../../../services/UserProfileAPI';
import { getErrorMessage } from '../../../services/utils';
import { scholarshipUserProfileSharedFormConfigs } from '../../../models/Utils';

export interface MentorProfileEditPropTypes {
    userProfileLoggedIn?: UserProfile,
}

function MentorProfileEdit(props: MentorProfileEditPropTypes) {

    const { userProfileLoggedIn } = props;
    
    const [mentor, setMentor] = useState<Mentor>();
    const [loadingUI, setLoadingUI] = useState({message: "", type: ""});

    const loadMentor = useCallback(
        () => {
    
        setLoadingUI({message: "Loading Mentor profile", type: "info"});
        UserProfileAPI.getUserContent(userProfileLoggedIn?.user, "mentor")
        .then((res: any) => {
            const { data } = res;
            console.log({res});
            setMentor(data);
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
        [userProfileLoggedIn]
      );

    const createMentorProfile = () => {
        setLoadingUI({message: "Creating your Mentor profile", type: "info"});
        MentorshipAPI.create(userProfileLoggedIn?.user!)
        .then((res: any) => {
            const { data } = res;
            console.log({res});
            setMentor(data);
        })
        .catch(error => {
            console.log({error});
            setLoadingUI({message: getErrorMessage(error), type: "error"});
        })
        .finally(()=> {
            setLoadingUI({message: "", type: ""});
        })
    }

    useEffect(() => {
        if (userProfileLoggedIn) {
            loadMentor();
        }
        
    }, [loadMentor, userProfileLoggedIn]);

    console.log({mentor});

  return (
    <div className='m-3'>
        <h1>Edit Mentor Profile</h1>
        {!mentor && 
            <Button onClick={createMentorProfile} disabled={!!loadingUI.message}>
                Create New Mentor Profile
            </Button>}

        {mentor && 
            <>
                <FormDynamic onUpdateForm={()=>{}}
                             model={mentor}
                             inputConfigs=
                                 {mentorProfileFormConfig}
                                 loggedInUserProfile={userProfileLoggedIn}
                />

                <FormDynamic onUpdateForm={()=>{}}
                                            model={mentor}
                                            inputConfigs=
                                                {scholarshipUserProfileSharedFormConfigs}
                                                loggedInUserProfile={userProfileLoggedIn} />
            </>
        }
            {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
        </div>
  )
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(MentorProfileEdit);
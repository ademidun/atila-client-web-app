import { Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import {connect} from "react-redux";
import Loading from '../../components/Loading';
import { UserProfile } from '../../models/UserProfile.class';
import UserProfileAPI from '../../services/UserProfileAPI';
import { getErrorMessage } from '../../services/utils';

export interface MentorProfileEditPropTypes {
    userProfileLoggedIn?: UserProfile,
}

function MentorProfileEdit(props: MentorProfileEditPropTypes) {

    const { userProfileLoggedIn } = props;
    
    const [mentor, setMentor] = useState({});
    const [loadingUI, setLoadingUI] = useState({message: "", type: ""});

    const loadMentor = useCallback(
        () => {
    
        setLoadingUI({message: "Loading Mentor profile", type: "info"});
        UserProfileAPI.getUserContent(userProfileLoggedIn?.user, "mentor")
        .then((res: any) => {
            const { data } = res;
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

    }

    useEffect(() => {
        if (userProfileLoggedIn) {
            loadMentor();
        }
        
    }, [loadMentor, userProfileLoggedIn])

  return (
    <div className='m-3'>
        <h1></h1>Edit Mentor Profile
        {!mentor && 
            <Button>
                Create New Mentor Profile
            </Button>}

        {mentor && 
            <Button>
                Create New Mentor Profile
            </Button>}

            {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
        </div>
  )
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(MentorProfileEdit);
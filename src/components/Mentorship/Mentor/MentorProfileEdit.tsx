import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, message } from 'antd';
import {connect} from "react-redux";
import FormDynamic from '../../Form/FormDynamic';
import Loading from '../../Loading';
import { Mentor } from '../../../models/Mentor';
import { mentorProfileFormConfig } from "../../../models/MentorConfig";
import { UserProfile } from '../../../models/UserProfile.class';
import MentorshipAPI from '../../../services/MentorshipAPI';
import UserProfileAPI from '../../../services/UserProfileAPI';
import { getErrorMessage } from '../../../services/utils';
import { scholarshipUserProfileSharedFormConfigs, toastNotify } from '../../../models/Utils';

let autoSaveTimeoutId: any;
export interface MentorProfileEditPropTypes {
    userProfileLoggedIn?: UserProfile,
}

function MentorProfileEdit(props: MentorProfileEditPropTypes) {

    const { userProfileLoggedIn } = props;
    
    const [mentor, setMentor] = useState<Mentor>();
    const [loadingUI, setLoadingUI] = useState({message: "", type: ""});
    const isMentorset = useRef(false);

    const loadMentor = useCallback(
        () => {
    
        setLoadingUI({message: "Loading Mentor profile", type: "info"});
        UserProfileAPI.getUserContent(userProfileLoggedIn?.user, "mentor")
        .then((res: any) => {
            const { data } = res;
            console.log({res});
            setMentor(data.mentor);
            isMentorset.current = true;
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
        MentorshipAPI.createMentor(userProfileLoggedIn?.user!)
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

    const updateForm = (event: any) => {

        if (event.stopPropagation) {
            event.stopPropagation();
        }

        if (!mentor){
            return
        }

        const value = event.target.value;

        let updatedmentor;
        let newValue = (mentor as any)[event.target.name];
            if ( Array.isArray((mentor as any)[event.target.name]) && !Array.isArray(value) ) {
                newValue.push(value);
            } else {
                newValue =value;
            }
            updatedmentor = {
                ...mentor,
                [event.target.name]: newValue
            };

            console.log({updatedmentor, mentor});

            setMentor(updatedmentor);
    };

    useEffect(() => {

        if ( !isMentorset.current ) {
            return;
          }

        if (autoSaveTimeoutId) {
            clearTimeout(autoSaveTimeoutId);
        }

        // Runs 1 second (1000 ms) after the last change
        autoSaveTimeoutId = setTimeout(() => {
            
            MentorshipAPI
            .patchMentor({mentor: mentor!})
            .then(res=>{
                message.success('Mentor Profile successfully saved!');
            })
            .catch(err=> {
                let postError = err.response && err.response.data;
                postError = JSON.stringify(postError, null, 4);
                toastNotify(`${postError}`, 'error');
            });
        }, 1000);
    }, [mentor]);

    useEffect(() => {
        if (userProfileLoggedIn) {
            loadMentor();
        }
        
    }, [loadMentor, userProfileLoggedIn]);

  return (
    <div className='m-3'>
        <h1>Edit Mentor Profile</h1>
        {!mentor && 
            <div className='text-center'>
            <h3>You must first create a mentor profile</h3>
                <Button onClick={createMentorProfile} disabled={!!loadingUI.message} type="primary">
                    Create Mentor Profile
                </Button>
            </div>
            }

        {mentor && 
            <>
            <label>
                Changes are automatically saved
            </label>
                <FormDynamic onUpdateForm={updateForm}
                             model={mentor}
                             inputConfigs=
                                 {mentorProfileFormConfig}
                                 loggedInUserProfile={userProfileLoggedIn}
                />

                <FormDynamic onUpdateForm={updateForm}
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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, message } from 'antd';
import {connect} from "react-redux";
import FormDynamic from '../../Form/FormDynamic';
import { Mentor } from '../../../models/Mentor';
import { mentorProfileFormConfig } from "../../../models/MentorConfig";
import { UserProfile } from '../../../models/UserProfile.class';
import MentorshipAPI from '../../../services/MentorshipAPI';
import UserProfileAPI from '../../../services/UserProfileAPI';
import { getErrorMessage } from '../../../services/utils';
import { scholarshipUserProfileSharedFormConfigs, toastNotify } from '../../../models/Utils';
import { RouteComponentProps, withRouter } from 'react-router';
import { NetworkResponse, NetworkResponseDisplay } from '../../NetworkResponse';
import MentorPrices from './MentorPrices';

let autoSaveTimeoutId: any;

interface RouteParamsProps {
    username: string,
    sessionId: string,
  };

export interface MentorProfileEditPropTypes extends RouteComponentProps<RouteParamsProps>  {
    userProfileLoggedIn?: UserProfile,
}

function MentorProfileEdit(props: MentorProfileEditPropTypes) {

    const { match: {params: { username }}, userProfileLoggedIn } = props;
    
    const [mentor, setMentor] = useState<Mentor>();
    const [networkResponse, setNetworkResponse] = useState<NetworkResponse>({title: "", type: null})
    const isMentorset = useRef(false);

    const loadMentor = useCallback(
        async () => {
    
        setNetworkResponse({title: "Loading Mentor profile", type: "loading"});
        try {
            if (username) {
                const res = await MentorshipAPI.listMentors(`?username=${username}`);
                const { data: {results: mentors } } = res;
                setMentor(mentors[0]);
                isMentorset.current = true;
            }
            else {
                const res = await UserProfileAPI.getUserContent(userProfileLoggedIn?.user, "mentor");
                const { data } = res;
                setMentor(data.mentor);
                isMentorset.current = true;
    
            }

            setNetworkResponse({title: "", type: null});
        } catch (error) {
            console.log({error});
            setNetworkResponse({title: getErrorMessage(error), type: "error"});
        }
          return ;// code that references a prop
        },
        [username, userProfileLoggedIn]
      );

    const createMentorProfile = () => {
        setNetworkResponse({title: "Creating your Mentor profile", type: "loading"});
        MentorshipAPI.createMentor(userProfileLoggedIn?.user!)
        .then((res: any) => {
            const { data } = res;
            setMentor(data);
            setNetworkResponse({title: "Mentor profile succesfully created!", type: "success"});
        })
        .catch(error => {
            console.log({error});
            setNetworkResponse({title: getErrorMessage(error), type: "error"});
        })
        .finally(()=> {
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
        <NetworkResponseDisplay response={networkResponse} />
        {!mentor && 
            <div className='text-center'>
            <h3>You must first create a mentor profile</h3>
                <Button onClick={createMentorProfile} disabled={networkResponse.type==='loading'} type="primary">
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
                < hr/>
                <MentorPrices initialPrices={mentor.prices} 
                onPricesChange={(prices: any) => setMentor({ ...mentor, prices })} />
                < hr/>

                <FormDynamic onUpdateForm={updateForm}
                                            model={mentor}
                                            inputConfigs=
                                                {scholarshipUserProfileSharedFormConfigs}
                                                loggedInUserProfile={userProfileLoggedIn} />
            </>
        }
        </div>
  )
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(MentorProfileEdit));
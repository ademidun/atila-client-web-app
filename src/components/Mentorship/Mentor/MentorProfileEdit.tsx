import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'antd';
import { useSelector } from "react-redux";
import FormDynamic from '../../Form/FormDynamic';
import { Mentor } from '../../../models/Mentor';
import { mentorProfileFormConfig } from "../../../models/MentorConfig";
import { UserProfile } from '../../../models/UserProfile.class';
import MentorshipAPI from '../../../services/MentorshipAPI';
import UserProfileAPI from '../../../services/UserProfileAPI';
import { getErrorMessage } from '../../../services/utils';
import { scholarshipUserProfileSharedFormConfigs } from '../../../models/Utils';
import { useParams } from 'react-router-dom';
import { NetworkResponse, NetworkResponseDisplay } from '../../NetworkResponse';
import MentorDurations from './MentorDurations';

let autoSaveTimeoutId: any;

interface RootState {
    data: {
        user: {
            loggedInUserProfile: UserProfile | null;
        }
    }
}

const MentorProfileEdit: React.FC = () => {
    const userProfileLoggedIn = useSelector((state: RootState) => state.data.user.loggedInUserProfile);
    const { mentorUsername } = useParams<{ mentorUsername: string }>();
    
    const [mentor, setMentor] = useState<Mentor | undefined>(undefined);
    const [networkResponse, setNetworkResponse] = useState<NetworkResponse>({title: "", type: null} as NetworkResponse);
    const [isMentorSet, setIsMentorSet] = useState(false);
    autoSaveTimeoutId = null;

    const loadMentor = useCallback(async () => {
        setNetworkResponse({title: "Loading Mentor profile", type: "loading"});
        
        try {
            if (mentorUsername) {
                const res = await MentorshipAPI.listMentors(`?username=${mentorUsername}`);
                const { data: {results: mentors } } = res;
                setMentor(mentors[0]);
                setIsMentorSet(true);
                setNetworkResponse({title: "", type: null});
            }
            else {
                const res = await UserProfileAPI.getUserContent(userProfileLoggedIn?.user, "mentor");
                const { data } = res;
                setMentor(data.mentor);
                setIsMentorSet(true);
                setNetworkResponse({title: "", type: null});
            }
        } catch (error) {
            console.log({error});
            setNetworkResponse({title: getErrorMessage(error), type: "error"});
        }
    },[userProfileLoggedIn, mentorUsername]);

    useEffect(() => {
        if (userProfileLoggedIn) {
            loadMentor();
        }
    }, [userProfileLoggedIn, loadMentor]);

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
        });
    }

    const updateForm = (event: any) => {
        if (event.stopPropagation) {
            event.stopPropagation();
        }

        const updatedMentor = {
            ...mentor,
            [event.target.name]: event.target.value
        } as Mentor;
        
        setMentor(updatedMentor);
        saveChanges();
    };

    const saveChanges = () => {
        if (!isMentorSet) {
            return;
        }

        if (autoSaveTimeoutId) {
            clearTimeout(autoSaveTimeoutId);
        }

        // Runs 1 second (1000 ms) after the last change
        autoSaveTimeoutId = setTimeout(() => {
            MentorshipAPI
            .patchMentor({mentor: mentor!})
            .then((res: any) => {
                const { data } = res;
                setMentor(data);
            })
            .catch(error => {
                console.log({error});
                setNetworkResponse({title: getErrorMessage(error), type: "error"});
            });
        }, 1000);
    }

    const handleDurationsSaved = (prices: any) => {
        if (mentor) {
            const updatedMentor = { ...mentor, prices } as Mentor;
            setMentor(updatedMentor);
            saveChanges();
        }
    }

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
                                inputConfigs={mentorProfileFormConfig}
                                loggedInUserProfile={userProfileLoggedIn}
                    />
                    <hr/>
                    <MentorDurations initialDurations={mentor.prices} 
                        onDurationsSaved={handleDurationsSaved} />
                    <hr/>

                    <FormDynamic onUpdateForm={updateForm}
                                model={mentor}
                                inputConfigs={scholarshipUserProfileSharedFormConfigs}
                                loggedInUserProfile={userProfileLoggedIn} />
                </>
            }
        </div>
    );
}

export default MentorProfileEdit;
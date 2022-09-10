import React, { useCallback, useEffect, useState } from 'react'
import { Mentor } from '../../../models/Mentor';
import MentorshipAPI from '../../../services/MentorshipAPI';
import UserProfileAPI from '../../../services/UserProfileAPI';
import { getErrorMessage } from '../../../services/utils';
import ContentBody from '../../ContentDetail/ContentBody/ContentBody';

interface MentorProfileViewProps {
    userId: number
}

export const MentorProfileView = (props: MentorProfileViewProps) => {

    const { userId } = props;

    const [mentor, setMentor] = useState<Mentor>();
    const [loadingUI, setLoadingUI] = useState({message: "", type: ""});

    const loadMentor = useCallback(
        () => {
    
        setLoadingUI({message: "Loading Mentor profile", type: "info"});
        UserProfileAPI.getUserContent(userId, "mentor")
        .then((res: any) => {
            const { data } = res;
            setMentor(data.mentor);
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
        [userId]
      );
    useEffect(() => {
        if (userId) {
            loadMentor();
        }
        
    }, [loadMentor, userId]);

  return (
    <div className='m-3'>
        {
            mentor && 
            <>
                <h3>
                    About me:
                </h3>
                <ContentBody body={mentor.bio} bodyType="html" />
                <h3>
                    Things I can mentor about
                </h3>
                <ContentBody body={mentor.mentorship_topics} bodyType="html" />
            </>
        }
    </div>
  )
}

export default MentorProfileView;
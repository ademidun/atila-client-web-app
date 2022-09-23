import React from 'react';
import { Mentor } from '../../../models/Mentor';
import ContentBody from '../../ContentDetail/ContentBody/ContentBody';
import DemographicsDisplay from '../../DemographicsDisplay';

interface MentorProfileViewProps {
    mentor: Mentor
}

export const MentorProfileView = (props: MentorProfileViewProps) => {

    const { mentor } = props;

  return (
    <div className='m-3'>
        {
            mentor && 
            <>

                <DemographicsDisplay model={mentor} />
                <hr/>
                <h3>
                    About me:
                </h3>
                <hr/>
                <p>
                    {mentor.description}
                </p>
                <br/>
                <ContentBody body={mentor.bio} bodyType="html" />
                <h3>
                    Things I can mentor about
                </h3>
                <hr/>
                <ContentBody body={mentor.mentorship_topics} bodyType="html" />
            </>
        }
    </div>
  )
}

export default MentorProfileView;
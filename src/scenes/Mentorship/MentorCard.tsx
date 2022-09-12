import React from 'react'
import ContentBody from '../../components/ContentDetail/ContentBody/ContentBody';
import DemographicsDisplay from '../../components/DemographicsDisplay';
import { UserProfilePreview } from '../../components/ReferredByInput';
import { Mentor } from '../../models/Mentor'

interface MentorCardProps {
    mentor: Mentor
}

function MentorCard(props: MentorCardProps) {

  const { mentor } = props;

  return (
    <div className='card shadow m-3 p-3'>
        <UserProfilePreview userProfile={mentor.user} linkProfile={true} />
        <DemographicsDisplay model={mentor} />
        <hr/>
        <h3>
            About me:
        </h3>
        <hr/>
        <ContentBody body={mentor.bio.substring(0,450)} bodyType="html" />
    </div>
  )
}

export default MentorCard
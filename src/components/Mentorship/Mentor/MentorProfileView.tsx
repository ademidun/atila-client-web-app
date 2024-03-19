import React from 'react';
import { Mentor } from '../../../models/Mentor';
import AudioPlay from '../../Audio/AudioPlay';
import ContentBody from '../../ContentDetail/ContentBody/ContentBody';
import DemographicsDisplay from '../../DemographicsDisplay';
import MentorPrices from './MentorPrices';

interface MentorProfileViewProps {
    mentor: Mentor,
    showProfilePic?: boolean,
}

export const MentorProfileView = (props: MentorProfileViewProps) => {

    const { mentor, showProfilePic } = props;

  return (
    <div className='m-3'>
        {
            mentor && 
            <>

                {showProfilePic && 
                
                <div>
                    <div className="col-sm-12 text-center">
                        <img
                        alt="user profile"
                        style={{ height: '250px', width: 'auto' }}
                        className="rounded-circle cursor-pointer"
                        src={mentor.user.profile_pic_url}
                        />
                    </div>
                    <div className="col-sm-12">
                        <h1>{ mentor.user.first_name }{' '}{ mentor.user.last_name }</h1>
                    </div>
                </div>
                }
                <hr/>
                <h3>
                    About me:
                </h3>
                {mentor.bio_recording_url && 
                    <>
                        <hr/>
                        <h5>
                            Listen to a voice note about me
                        </h5>
                        <AudioPlay audioUrl={mentor.bio_recording_url} />
                    </>
                }
                <hr/>
                <p>
                    {mentor.description}
                </p>
                    {mentor.prices && 
                        <>
                            < hr/>
                            <MentorPrices initialPrices={mentor.prices} viewOnly={true} />
                            < hr/>
                        </>
                    }
                <br/>
                <ContentBody body={mentor.bio} bodyType="html" />
                <hr/>
                <DemographicsDisplay model={mentor} />
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
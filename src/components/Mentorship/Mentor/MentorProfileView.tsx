import React from 'react';
import { Mentor } from '../../../models/Mentor';
import ContentBody from '../../ContentDetail/ContentBody/ContentBody';
import DemographicsDisplay from '../../DemographicsDisplay';

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
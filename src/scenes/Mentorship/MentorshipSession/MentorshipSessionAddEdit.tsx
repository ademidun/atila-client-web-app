import React, { useState } from 'react'
import { connect } from 'react-redux'
import { UserProfile } from '../../../models/UserProfile.class';
import { Button, Steps } from 'antd';
import SelectMentor from './SelectMentor';
import { MentorshipSession } from '../../../models/MentorshipSession';
import MentorshipSessionPayment from './MentorshipSessionPayment/MentorshipSessionPayment';

const { Step } = Steps;


export interface MentorshipSessionAddEditProps {
    userProfileLoggedIn?: UserProfile,
}

export const MentorshipSessionAddEdit = (props: MentorshipSessionAddEditProps) => {
    const [currentSessionStep, setCurrentSessionStep] = useState(1);
    const [mentorshipSession, setMentorshipSession] = useState<MentorshipSession>()


    const mentorshipSessionSteps = [
        {
          title: 'Select',
          content: ()=> <SelectMentor onSelectMentor={mentor => mentorshipSession ? setMentorshipSession({...mentorshipSession, mentor: mentor.id}) : null } />,
          disabled: () => false,
        },
        {
          title: 'Pay',
          content: ()=> <div>
            <MentorshipSessionPayment />
          </div>,
          disabled: () => false,
        },
        {
          title: 'Schedule',
          content: ()=> <div>
            Pick a time that works for you
          </div>,
          disabled: () => true,
        },
        {
          title: 'Prepare',
          content: ()=> <div>
           Fill out an intake form for what you want from the session
          </div>,
          disabled: () => true,
        },
        {
          title: 'Attend',
          content: ()=> <div>
            Details of your mentorship session
          </div>,
          disabled: () => true,
        },
    ];
  return (
    <div className='container card shadow m-3 p-3'>
      <Steps current={currentSessionStep} onChange={current => setCurrentSessionStep(current)}>
        {mentorshipSessionSteps.map(item => (
          <Step key={item.title} title={item.title} disabled={item.disabled()} />
        ))}
      </Steps>

      <div className='container card shadow m-3 p-3'>
        {mentorshipSessionSteps[currentSessionStep].content()}
      </div>

      <div>
        {currentSessionStep < mentorshipSessionSteps.length - 1 && (
          <Button type="primary" className="btn btn-outline-primary float-right col-md-6"

          disabled={mentorshipSessionSteps[currentSessionStep + 1].disabled()}
            onClick={() => setCurrentSessionStep(currentSessionStep + 1)}>
            Next
          </Button>
        )}
        {currentSessionStep > 1 && (
          <Button className="btn btn-outline-primary float-right col-md-6"
            onClick={() => setCurrentSessionStep(currentSessionStep - 1)} >
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MentorshipSessionAddEdit)
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Steps } from 'antd';
import SelectMentor from './SelectMentor';
import { MentorshipSession } from '../../../models/MentorshipSession';
import MentorshipSessionPayment from './MentorshipSessionPayment/MentorshipSessionPayment';

const { Step } = Steps;

export const MentorshipSessionAddEdit = () => {

    const [currentSessionStep, setCurrentSessionStep] = useState(0);
    const [mentorshipSession, setMentorshipSession] = useState<MentorshipSession>();


    const mentorshipSessionSteps = [
        {
          title: 'Select',
          content: (session: MentorshipSession)=> 
          <SelectMentor onSelectMentor={mentor => setMentorshipSession({...mentorshipSession, mentor}) } />,
          disabled: () => false,
        },
        {
          title: 'Pay',
          content: (session: MentorshipSession)=> <div>
            <MentorshipSessionPayment session={session} onPaymentComplete={session => 
              setMentorshipSession({...mentorshipSession, id: session.id, stripe_payment_intent_id: session.stripe_payment_intent_id}) }  />
          </div>,
          disabled: () => !mentorshipSession?.mentor,
        },
        {
          title: 'Schedule',
          content: (session: MentorshipSession)=> <div>
            Pick a time that works for you
          </div>,
          disabled: () => !mentorshipSession?.stripe_payment_intent_id,
        },
        {
          title: 'Prepare',
          content: (session: MentorshipSession)=> <div>
           Fill out an intake form for what you want from the session
          </div>,
          disabled: () => !mentorshipSession?.stripe_payment_intent_id,
        },
        {
          title: 'Attend',
          content: (session: MentorshipSession)=> <div>
            Details of your mentorship session
          </div>,
          disabled: () => !mentorshipSession?.stripe_payment_intent_id,
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
        {mentorshipSessionSteps[currentSessionStep].content(mentorshipSession!)}
      </div>

      <div>
        {currentSessionStep < mentorshipSessionSteps.length - 1 && (
          <Button type="primary" className="btn btn-outline-primary float-right col-md-6"

          disabled={mentorshipSessionSteps[currentSessionStep + 1].disabled()}
            onClick={() => setCurrentSessionStep(currentSessionStep + 1)}>
            Next
          </Button>
        )}
        {currentSessionStep > 0 && (
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
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Steps } from 'antd';
import SelectMentor from './SelectMentor';
import { MentorshipSession } from '../../../models/MentorshipSession';
import MentorshipSessionPayment from './MentorshipSessionPayment/MentorshipSessionPayment';
import FormDynamic from '../../../components/Form/FormDynamic';
import MentorshipSessionSchedule from './MentorshipSessionSchedule';

const { Step } = Steps;

export const MentorshipSessionAddEdit = () => {

    const [currentSessionStep, setCurrentSessionStep] = useState(0);
    const [mentorshipSession, setMentorshipSession] = useState<MentorshipSession>({notes: ''});

    // TODO move this inside MentorshipSessionSchedule
    const isCalendlyEvent = (e: any) => {
      return e.data.event &&
             e.data.event.indexOf('calendly') === 0;
    };

    const handleCalendlyEvent = (e: any) => {
      if (isCalendlyEvent(e)) {
        console.log(e);
        console.log(e.data);
        if (e.data.event === "calendly.date_and_time_selected") {
          // change the page when the date and time is selected
          setCurrentSessionStep(currentSessionStep + 1);
        }
      }
    };
     
    useEffect(() => {
      window.addEventListener(
        'message',
        handleCalendlyEvent 
      );
    
      return () => {
        window.removeEventListener(
          'message',
          handleCalendlyEvent 
        );
      }
    }, )
    

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
              setMentorshipSession({...mentorshipSession, ...session}) }  />
          </div>,
          disabled: () => !mentorshipSession?.mentor,
        },
        {
          title: 'Schedule',
          content: (session: MentorshipSession)=> <div>
            <h1>
            Pick a time that works for you
            </h1>

            <MentorshipSessionSchedule />
          </div>,
          disabled: () => false
        },
        {
          title: 'Prepare',
          content: (session: MentorshipSession)=> {
            const sessionIntakeInputConfigs = [
              {
                keyName: 'notes',
                type: 'html_editor',
                html: () => (<label htmlFor="notes">
                    Fill notes before your session.<br/> Tip: Copy-paste and edit these notes in a seperate document like {' '}
                    <a href="https://docs.new" target="_blank" rel="noopener noreferrer">
                     Google docs</a> then copy-paste them back here.
                </label>),
                }
            ]
            return (
              <div>
                <FormDynamic onUpdateForm={(event: any) =>
                                            setMentorshipSession({...mentorshipSession, [event.target.name]: event.target.value})}
                                            model={session}
                                            inputConfigs=
                                                {sessionIntakeInputConfigs}
                                                loggedInUserProfile={{}} />
              </div>
            )
          },
          disabled: () => false
        },
        {
          title: 'Attend',
          content: (session: MentorshipSession)=> <div>
            Details of your mentorship session
          </div>,
          disabled: () => false
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
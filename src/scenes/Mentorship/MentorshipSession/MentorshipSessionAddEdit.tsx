import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Steps } from 'antd';
import { MentorshipSession } from '../../../models/MentorshipSession';
import MentorshipSessionPayment from './MentorshipSessionPayment/MentorshipSessionPayment';
import FormDynamic from '../../../components/Form/FormDynamic';
import MentorshipSessionSchedule from './MentorshipSessionSchedule';
import MentorshipAPI from '../../../services/MentorshipAPI';
import { getErrorMessage } from '../../../services/utils';
import Loading from '../../../components/Loading';
import TextUtils from '../../../services/utils/TextUtils';

const { Step } = Steps;

export const MentorshipSessionAddEdit = () => {

    const [currentSessionStep, setCurrentSessionStep] = useState(0);
    const [mentorshipSession, setMentorshipSession] = useState<MentorshipSession>({notes: ''});
    const [loadingUI, setLoadingUI] = useState({message: "", type: ""});
  
    const loadMentor = useCallback(
      () => {
  
      setLoadingUI({message: "Loading Mentor profile", type: "info"});
      MentorshipAPI.listMentors()
      .then((res: any) => {
          const { data: {results: mentors } } = res;
          setMentorshipSession(session => ({...session, mentor: mentors[0]}))
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
      []
    );

    const handleCalendarEventViewed = (session: MentorshipSession) => {
      if (!session.stripe_payment_intent_id) { // if session has not been payed for yet
        // if the current step is on the preview page (currentSessionStep === 0) then go to the next step which is payment currentSessionStep + 1
        // else, go to the previous step which should also be payment.
        setCurrentSessionStep( currentSessionStep === 0 ? currentSessionStep + 1 : currentSessionStep - 1);
      }
    }
  
    // when the currentSessionStep changes, scroll back to the top of the page
    useEffect(() => {
      window.scrollTo(0,0); 
    }, [currentSessionStep]);
  
    useEffect(() => {
      loadMentor();  
    }, [loadMentor]);
    

    const mentorshipSessionSteps = [
        {
          title: 'Preview',
          content: (session: MentorshipSession)=> 
          <div>
            <div className='text-center'>
              <h1>
              Preview {session.mentor ? `${TextUtils.dynamicPossessive(session.mentor.user.first_name)}` : "mentor's" } schedule and find a time that works for you
              </h1>
              <h3>
                You can confirm this time after payment.
              </h3>
            </div>

            <MentorshipSessionSchedule session={session} onDateAndTimeSelected={handleCalendarEventViewed} />
          </div>,
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
            Schedule a time{session.mentor ? ` with ${session.mentor.user.first_name} ` : " " }that works for you
            </h1>

            <MentorshipSessionSchedule session={session} onDateAndTimeSelected={handleCalendarEventViewed} />
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
        {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
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
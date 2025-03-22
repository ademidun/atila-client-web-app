import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Steps } from 'antd';
import { MentorshipSession } from '../../../models/MentorshipSession';
import MentorshipSessionPayment from './MentorshipSessionPayment/MentorshipSessionPayment';
import MentorshipSessionSchedule from './MentorshipSessionSchedule';
import MentorshipAPI from '../../../services/MentorshipAPI';
import { getErrorMessage } from '../../../services/utils';
import TextUtils from '../../../services/utils/TextUtils';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import HelmetSeo, { defaultSeoContent } from '../../../components/HelmetSeo';
import { UserProfile } from '../../../models/UserProfile.class';
import Register from '../../../components/Register';
import { NetworkResponse, NetworkResponseDisplay } from '../../../components/NetworkResponse';
import { Duration } from '../../../models/Mentor';
import { initialReduxState } from '../../../models/Constants';

const { Step } = Steps;

const MentorshipSessionAddEdit: React.FC = () => {
    const userProfileLoggedIn = useSelector((state: typeof initialReduxState) => state.data.user.loggedInUserProfile);
    const location = useLocation();
    const navigate = useNavigate();
    const { mentorUsername, sessionId } = useParams<{ mentorUsername: string; sessionId: string }>();
    const [isNewSession, setIsNewSession] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const paymentComplete = searchParams.get('paymentComplete');

    const [currentSessionStep, setCurrentSessionStep] = useState(0);
    const [mentorshipSession, setMentorshipSession] = useState<MentorshipSession>({notes: ''});
    const [networkResponse, setNetworkResponse] = useState<NetworkResponse>({title: "", type: null})
    const [seoContent, setSeoContent] = useState({
        ...defaultSeoContent,
        title: "Book a Mentorship session",
    })
  
    const loadMentor = useCallback(
      () => {
        if (!mentorUsername) return;
        
        setNetworkResponse({title: "Loading Mentor profile", type: "loading"});
        MentorshipAPI.listMentors(`?username=${mentorUsername}`)
        .then((res: any) => {
            const { data: {results: mentors } } = res;
            const mentor = mentors[0];
            setMentorshipSession(session => ({...session, mentor}))
            setSeoContent(content => ({...content, title: `Book a mentorship session with ${mentor.user.first_name}`}))
        })
        .catch(error => {
          console.log({error});
          setNetworkResponse({title: getErrorMessage(error), type: "error"});
        })
        .finally(()=> {
          setNetworkResponse({title: "", type: null});
        })
      },
      [mentorUsername]
    );
  
    const loadSession = useCallback(
      () => {
        if (!sessionId) return;
        
        setNetworkResponse({title: "Loading session details", type: "loading"});
        MentorshipAPI.getSession(sessionId)
        .then((res: any) => {
            const { data }: { data: MentorshipSession} = res;
            setMentorshipSession(data)
            setSeoContent(content => ({...content, title: `Book a mentorship session with ${data.mentor!.user.first_name}`}))
            setCurrentSessionStep(data.event_scheduled ? 3 : 2);
        })
        .catch(error => {
            console.log({error});
            setNetworkResponse({title: getErrorMessage(error), type: "error"});
        })
        .finally(()=> {
          setNetworkResponse({title: "", type: null});
        })
      },
      [sessionId]
    );

    const handleCalendarEventViewed = (session: MentorshipSession) => {
      if (!session.stripe_payment_intent_id) { // if session has not been payed for yet
        // if the current step is on the preview page (currentSessionStep === 0) then go to the next step which is payment currentSessionStep + 1
        // else, go to the previous step which should also be payment.
        setCurrentSessionStep( currentSessionStep === 0 ? currentSessionStep + 1 : currentSessionStep - 1);
      }
    }

    const handleCalendarEventScheduled = (session: MentorshipSession, eventDetails: any) => {

      setNetworkResponse({title: "Saving event details.", type: "loading"});
      MentorshipAPI.sessionScheduled(session.id!, eventDetails)
      .then(res => {
        const { data } = res;
        console.log({data});
        setMentorshipSession(data);
      })
      .catch(error => {
        console.log({error});
        setNetworkResponse({title: getErrorMessage(error), type: "error"});
      })
      .finally(()=> {
        setNetworkResponse({title: "", type: null});
      })
    }

    const handlePaymentComplete = (session: MentorshipSession) => {

      setNetworkResponse({title: "Saving payment confirmation. Don't leave this page.", type: "loading"});
      MentorshipAPI.patchSession({id: session.id, stripe_payment_intent_id: session.stripe_payment_intent_id, duration: session.duration})
      .then(res => {
        const { data } = res;
        console.log({data});
        setMentorshipSession(data);
        setCurrentSessionStep(currentSessionStep+1);
        navigate(`/mentorship/session/${session.id}?paymentComplete=true`);
      })
      .catch(error => {
        console.log({error});
        setNetworkResponse({title: getErrorMessage(error), type: "error"});
      })
      .finally(()=> {
        setNetworkResponse({title: "", type: null});
      })
    }

    const handleDurationSelected = (duration: Duration) => {
      console.log('handleDurationSelected', {duration});
      console.log({mentorshipSession});
      setMentorshipSession({
        ...mentorshipSession,
        duration
      });
      setCurrentSessionStep(currentSessionStep+1);
    }
  
    // when the currentSessionStep changes, scroll back to the top of the page
    useEffect(() => {
      window.scrollTo(0,0); 
    }, [currentSessionStep]);
  
    useEffect(() => {
        const path = location.pathname;
        setIsNewSession(path.includes('/new/'));
        if (path.includes('/session/new')) {
            loadMentor(); 
        } else {
            loadSession();
        }
    }, [loadMentor, loadSession, location.pathname]);

    const registerProps = {
      disableRedirect: true,
      onRegistrationFinished: () => window.scrollTo(0,0)
    } as const;
    

    const mentorshipSessionSteps = [
        {
          title: 'View',
          content: (session: MentorshipSession) => (
            <div>
              <div className='text-center'>
                <h1>
                  View {session.mentor ? `${TextUtils.dynamicPossessive(session.mentor.user.first_name)}` : "mentor's" } Profile
                </h1>
                <h3 className='text-muted'>
                  You can confirm this time after payment.
                </h3>
              </div>
              <hr/>

              <MentorshipSessionSchedule previewMode={true} session={session} 
                onDateAndTimeSelected={handleCalendarEventViewed} 
                onDurationSelected={handleDurationSelected} />
            </div>
          ),
          disabled: () => false,
        },
        {
          title: 'Pay',
          content: (session: MentorshipSession) => (
            <div>
              {userProfileLoggedIn ? 
                <MentorshipSessionPayment session={session} onPaymentComplete={handlePaymentComplete} /> : 
                <div>
                  <h1>Create an Account or Login to book a session</h1>
                  <br/>
                  {React.createElement(Register as any, registerProps)}
                </div>
              }
            </div>
          ),
          disabled: () => !mentorshipSession?.mentor,
        },
        {
          title: 'Schedule',
          content: (session: MentorshipSession)=> <div>
            <h1>
            Schedule a time{session.mentor ? ` with ${session.mentor.user.first_name} ` : " " }that works for you
            </h1>

            {paymentComplete &&
              <Alert type="success" message="Payment succesfully completed" className='mb-3'/>
            }

            <MentorshipSessionSchedule session={session} onDateAndTimeSelected={handleCalendarEventViewed} 
            onEventScheduled={handleCalendarEventScheduled} />
          </div>,
          disabled: () => {
            return !userProfileLoggedIn?.is_atila_admin && (!mentorshipSession?.stripe_payment_intent_id)
          }
        },
        // {
        //   title: 'Prepare',
        //   content: (session: MentorshipSession)=> {
        //     const sessionIntakeInputConfigs = [
        //       {
        //         keyName: 'notes',
        //         type: 'html_editor',
        //         html: () => (<label htmlFor="notes">
        //             Fill notes before your session.<br/> Tip: Copy-paste and edit these notes in a seperate document like {' '}
        //             <a href="https://docs.new" target="_blank" rel="noopener noreferrer">
        //              Google docs</a> then copy-paste them back here.
        //         </label>),
        //         }
        //     ]
        //     return (
        //       <div>
        //         <FormDynamic onUpdateForm={(event: any) =>
        //                                     setMentorshipSession({...mentorshipSession, [event.target.name]: event.target.value})}
        //                                     model={session}
        //                                     inputConfigs=
        //                                         {sessionIntakeInputConfigs}
        //                                         loggedInUserProfile={{}} />
        //       </div>
        //     )
        //   },
        //   disabled: () => !mentorshipSession?.stripe_payment_intent_id
        // },
        // { // TODO find way to pull event details to Atila database
        //   title: 'Attend',
        //   content: (session: MentorshipSession)=> <div>
        //     Details of your mentorship session
        //   </div>,
        //   disabled: () => !mentorshipSession?.stripe_payment_intent_id
        // },
    ];

    const handleViewAllMentors = () => {
      navigate('/mentorship');
    };

    return (
      <div className='card shadow m-3 p-3'>
        <HelmetSeo content={seoContent}/>
        <Steps current={currentSessionStep} onChange={current => setCurrentSessionStep(current)} {...({} as any)}>
          {mentorshipSessionSteps.map(item => (
            <Step key={item.title} title={item.title} disabled={item.disabled()} />
          ))}
        </Steps>

        <div className='m-3 p-3'>
          <NetworkResponseDisplay response={networkResponse} />
          {mentorshipSessionSteps[currentSessionStep].content(mentorshipSession!)}
        </div>

        <div>
          {currentSessionStep > 0 ? (
            <Button className="float-left col-md-6"
              onClick={() => setCurrentSessionStep(currentSessionStep - 1)} >
              Previous
            </Button>
          ): 
            <Button className="float-left col-md-6" onClick={handleViewAllMentors}>
              View all Mentors
            </Button>
          }
        </div>
      </div>
    );
}

export default MentorshipSessionAddEdit;
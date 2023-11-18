import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Alert, Button, Steps } from 'antd';
import { MentorshipSession } from '../../../models/MentorshipSession';
import MentorshipSessionPayment from './MentorshipSessionPayment/MentorshipSessionPayment';
import MentorshipSessionSchedule from './MentorshipSessionSchedule';
import MentorshipAPI from '../../../services/MentorshipAPI';
import { getErrorMessage } from '../../../services/utils';
import TextUtils from '../../../services/utils/TextUtils';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import HelmetSeo, { defaultSeoContent } from '../../../components/HelmetSeo';
import { UserProfile } from '../../../models/UserProfile.class';
import Register from '../../../components/Register';
import { NetworkResponse, NetworkResponseDisplay } from '../../../components/NetworkResponse';

const { Step } = Steps;

interface CollectionDetailRouteParams {
  mentorUsername: string,
  sessionId: string,
};

export interface MentorshipSessionAddEditProps extends RouteComponentProps<CollectionDetailRouteParams>  {
  userProfileLoggedIn?: UserProfile,
}

export const MentorshipSessionAddEdit = (props: MentorshipSessionAddEditProps) => {


    const { location: { search }, match: {params: { mentorUsername, sessionId }}, userProfileLoggedIn } = props;

    const searchParams = new URLSearchParams(search);

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
        return ;// code that references a prop
      },
      [mentorUsername]
    );
  
    const loadSession = useCallback(
      () => {
  
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
        return ;// code that references a prop
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
      MentorshipAPI.patchSession({id: session.id, stripe_payment_intent_id: session.stripe_payment_intent_id})
      .then(res => {
        const { data } = res;
        console.log({data});
        setMentorshipSession(data);
        setCurrentSessionStep(currentSessionStep+1);
        props.history.push(`/mentorship/session/${session.id}?paymentComplete=true`);
      })
      .catch(error => {
        console.log({error});
        setNetworkResponse({title: getErrorMessage(error), type: "error"});
      })
      .finally(()=> {
        setNetworkResponse({title: "", type: null});
      })
    }
  
    // when the currentSessionStep changes, scroll back to the top of the page
    useEffect(() => {
      window.scrollTo(0,0); 
    }, [currentSessionStep]);
  
    useEffect(() => {
      if (props.location.pathname.includes('/session/new')) {
        loadMentor(); 
      } else {
        loadSession();
      }
       
    }, [loadMentor, loadSession, props.location.pathname]);

    const registerProps = { // make sure all required component's inputs/Props keys&types match
      disableRedirect: true,
      onRegistrationFinished: () => window.scrollTo(0,0)
    }
    

    const mentorshipSessionSteps = [
        {
          title: 'View',
          content: (session: MentorshipSession)=> 
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

            <MentorshipSessionSchedule previewMode={true} session={session} onDateAndTimeSelected={handleCalendarEventViewed} />
          </div>,
          disabled: () => false,
        },
        {
          title: 'Pay',
          content: (session: MentorshipSession)=> <div>

            { userProfileLoggedIn ? 
            <MentorshipSessionPayment session={session} onPaymentComplete={handlePaymentComplete}  /> : 

              <div>
              <h1>Create an Account or Login to book a session</h1> <br/>
              {/*
              
                Assign register props using spread operator
                Needed to resolve the following error: Type '{ disableRedirect: boolean; }' is not assignable to type 'IntrinsicAttributes & ... 
              
              */}
              <Register {...registerProps} />
                        
              </div>
            }
            
          </div>,
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
  return (
    <div className='card shadow m-3 p-3'>
      <HelmetSeo content={seoContent}/>
      <Steps current={currentSessionStep} onChange={current => setCurrentSessionStep(current)}>
        {mentorshipSessionSteps.map(item => (
          <Step key={item.title} title={item.title} disabled={item.disabled()} />
        ))}
      </Steps>

      <div className='m-3 p-3'>
        <NetworkResponseDisplay response={networkResponse} />
        {mentorshipSessionSteps[currentSessionStep].content(mentorshipSession!)}
      </div>

      <div>
        {currentSessionStep < mentorshipSessionSteps.length - 1 && (
          <Button type="primary" className="float-right col-md-6"

          disabled={mentorshipSessionSteps[currentSessionStep + 1].disabled()}
            onClick={() => setCurrentSessionStep(currentSessionStep + 1)}>
            Next
          </Button>
        )}
        {currentSessionStep > 0 ? (
          <Button className="float-right col-md-6"
            onClick={() => setCurrentSessionStep(currentSessionStep - 1)} >
            Previous
          </Button>
        ): 
        <Link to="/mentorship">
          <Button className="float-right col-md-6">
            View all Mentors
          </Button>
          
        </Link>
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => {
    return { userProfileLoggedIn: state.data.user.loggedInUserProfile };
};

const mapDispatchToProps = {}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MentorshipSessionAddEdit))
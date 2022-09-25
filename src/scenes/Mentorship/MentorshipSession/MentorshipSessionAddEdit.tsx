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
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import HelmetSeo, { defaultSeoContent } from '../../../components/HelmetSeo';
import { UserProfile } from '../../../models/UserProfile.class';
import Register from '../../../components/Register';

const { Step } = Steps;

interface CollectionDetailRouteParams {
  mentorUsername: string
};

export interface MentorshipSessionAddEditProps extends RouteComponentProps<CollectionDetailRouteParams>  {
  userProfileLoggedIn?: UserProfile,
}

export const MentorshipSessionAddEdit = (props: MentorshipSessionAddEditProps) => {


    const { match: {params: { mentorUsername }}, userProfileLoggedIn } = props;

    const [currentSessionStep, setCurrentSessionStep] = useState(0);
    const [mentorshipSession, setMentorshipSession] = useState<MentorshipSession>({notes: ''});
    const [loadingUI, setLoadingUI] = useState({message: "", type: ""});
    const [seoContent, setSeoContent] = useState({
      ...defaultSeoContent,
      title: "Book a Mentorship session",
  })
  
    const loadMentor = useCallback(
      () => {
  
      setLoadingUI({message: "Loading Mentor profile", type: "info"});
      MentorshipAPI.listMentors(`?username=${mentorUsername}`)
      .then((res: any) => {
          const { data: {results: mentors } } = res;
          const mentor = mentors[0];
          setMentorshipSession(session => ({...session, mentor}))
          setSeoContent(content => ({...content, title: `Book a mentorship session with ${mentor.user.first_name}`}))
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
      [mentorUsername]
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
              Preview {session.mentor ? `${TextUtils.dynamicPossessive(session.mentor.user.first_name)}` : "mentor's" } schedule
              </h1>
              <h3 className='text-muted'>
                You can confirm this time after payment.
              </h3>
            </div>
            <hr/>

            <MentorshipSessionSchedule session={session} onDateAndTimeSelected={handleCalendarEventViewed} />
          </div>,
          disabled: () => false,
        },
        {
          title: 'Pay',
          content: (session: MentorshipSession)=> <div>

            { userProfileLoggedIn ? 
            <MentorshipSessionPayment session={session} onPaymentComplete={session => 
              setMentorshipSession({...mentorshipSession, ...session}) }  /> : 

              <div>
              <h1>Create an Account or Login to book a session</h1> <br/>
              <Register disableRedirect={true} className=""/>
                        
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

            <MentorshipSessionSchedule session={session} onDateAndTimeSelected={handleCalendarEventViewed} />
          </div>,
          disabled: () => !mentorshipSession?.stripe_payment_intent_id
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
          disabled: () => !mentorshipSession?.stripe_payment_intent_id
        },
        {
          title: 'Attend',
          content: (session: MentorshipSession)=> <div>
            Details of your mentorship session
          </div>,
          disabled: () => !mentorshipSession?.stripe_payment_intent_id
        },
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
        {loadingUI.message && <Loading isLoading={loadingUI.message} title={loadingUI.message} />}
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
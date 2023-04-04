import { Row, Col, Alert } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading';
import MentorProfileView from '../../../components/Mentorship/Mentor/MentorProfileView';
import { MentorshipSession } from '../../../models/MentorshipSession';
import Cal from '@calcom/embed-react';

const calendlyWidgetScript = 'calendlyWidgetScript';
const calendarDivId = 'calendarForm';

interface MentorshipSessionScheduleProps {
  session: MentorshipSession,
  onDateAndTimeSelected: (session: MentorshipSession) => void,
  onEventTypeViewed: (session: MentorshipSession) => void,
  onEventScheduled: (session: MentorshipSession, eventData: any) => void,
}

MentorshipSessionSchedule.defaultProps = {
  onDateAndTimeSelected: () => null,
  onEventTypeViewed: () => null,
  onEventScheduled: () => null,
}

function MentorshipSessionSchedule(props: MentorshipSessionScheduleProps) {

  const { session, session: { mentor }, onDateAndTimeSelected, onEventTypeViewed, onEventScheduled } = props;
  const [loadingCalendar, setLoadingCalendar] = useState("Loading calendar");

  const [width, setWidth] = useState<number>(window.innerWidth);

  const CALCOM_URL = "https://cal.com/"

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  const isMobile = width <= 768;
  

    useEffect(() => {
        const head = document.querySelector('head');
        if (!document.getElementById(calendlyWidgetScript) && head) {
            const script = document.createElement('script');
            script.setAttribute('src',  'https://assets.calendly.com/assets/external/widget.js');
            script.setAttribute('id',  calendlyWidgetScript);
            head.appendChild(script);

            script.onload = () => {
              // script has loaded, you can now use it safely
              console.log('script has finished loading');
          }
        }

        return () => {
          if (document.getElementById(calendlyWidgetScript) && head) {
            const script = document.getElementById(calendlyWidgetScript);
            script?.remove();

            const calendar = document.getElementById(calendarDivId);
            calendar?.remove();
        }
      }
    }, []);



    // TODO move this inside MentorshipSessionSchedule
    const isCalendlyEvent = (e: any) => {
      return e.data.event &&
             e.data.event.indexOf('calendly') === 0;
    };

    const handleCalendlyEvent = (e: any) => {
      if (isCalendlyEvent(e)) {
        console.log(e);
        console.log(e.data);
        if (e.data.event === "calendly.event_type_viewed") {
          // once the "event_type_viewed" event is emitted, we know the calendar has loadedFd
          setLoadingCalendar("");
          onEventTypeViewed(session);
        }
        else if (e.data.event === "calendly.date_and_time_selected") {
          // change the page when the date and time is selected
          onDateAndTimeSelected(session);
        }
        else if (e.data.event === "calendly.event_scheduled") {
          // change the page when the event has been scheduled
          onEventScheduled(session, e.data.payload);
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
    }, );
    

  return (
    <div>
  {mentor && 
    <Row gutter={16}>
      <Col sm={24} md={12}>
        <div id={calendarDivId} className='card shadow'>
          {mentor.schedule_url ? (
            <div>
              {loadingCalendar && <Loading title={loadingCalendar} />}
              {session.event_scheduled && (
                <Alert 
                  message="Note: You've already created an event for this session. 
                    Check your calendar for event details."
                  type='warning'
                />
              )}
              <>
                {mentor.schedule_url.includes(CALCOM_URL) ? (
                  <Cal
                    calLink={mentor.schedule_url.replace(CALCOM_URL, '')}
                    config={{
                      name: "John Doe",
                      email: "johndoe@gmail.com",
                      notes: "Test Meeting",
                      guests: ["janedoe@gmail.com"],
                      // theme: "dark",
                    }}
                  />
                ) : (
                  <div 
                    className="calendly-inline-widget"
                    data-url={mentor.schedule_url}
                    style={{ minWidth: isMobile ? '400px' : "550px", height: isMobile ? '650px' : "1000px" }}
                  />
                )}
              </>
            </div>
          ) : (
            <div className='text-center p-3'>
              <h5>
                No available times for this mentor: <Link to="/mentorship">View all Mentors</Link>
              </h5>
            </div>
          )}
        </div>
      </Col>
      <Col sm={24} md={12}>
        <MentorProfileView mentor={mentor} showProfilePic={true} />
      </Col>
    </Row>
  }
</div>

  )
}

export default MentorshipSessionSchedule
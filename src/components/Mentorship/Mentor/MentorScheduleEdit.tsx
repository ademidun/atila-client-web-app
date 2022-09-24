/**
 * See: docs/mentorship/README.md
 */
import { Button, List, Tag } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router';
import Environment from '../../../services/Environment'
import ScheduleAPI from '../../../services/ScheduleAPI';
// import MentorEventTypes from '../../../services/mocks/Mentorship/MentorEventTypes.json';
import MentorshipAPI from '../../../services/MentorshipAPI';
import { Mentor } from '../../../models/Mentor';

export const CALENDLY_AUTH_URL = `https://auth.calendly.com/oauth/authorize?client_id=${Environment.CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=https://atila.ca/profile`





interface RouteParams {pageId: string};
interface MentorScheduleEditProps extends RouteComponentProps<RouteParams>  {
  mentor: Mentor
}

const calendarAccessTokenKeyName = 'calendarAccessToken';
function MentorScheduleEdit(props: MentorScheduleEditProps) {
    
    const {location: {search}, mentor}  = props;

    const params = new URLSearchParams(search);

    console.log('params', params);
    console.log("(params.get('code')", params.get('code'));

    const [calendarAuthCode, setCalendarAuthCode] = useState(params.get('code') || '');
    const [calendarAccessToken, setCalendarAccessToken] = useState(JSON.parse(localStorage.getItem(calendarAccessTokenKeyName)||'{}'));
    const [mentorEventTypes, setMentorEventTypes] = useState<any[]>([]);
    const isFirstRender = useRef(true);

    useEffect(() => {

      console.log('useEffect(): params', params);
      console.log("useEffect(): params.get('code')", params.get('code'));
      console.log({calendarAuthCode, isFirstRender});
      if (isFirstRender.current && calendarAuthCode) {
        getUserSchedule();
        isFirstRender.current = false;
      }
    })

    const getUserSchedule =  async () => {

      // either get the current calendarAccessToken or fetch it from the API
      // if it returns an empty string, then exit this call as the required credentials does not exist
      console.log('getUserSchedule', calendarAccessToken);
      let localCalendarAccessToken = calendarAccessToken.access_token ?  calendarAccessToken : await getAccessToken();
      console.log('localCalendarAccessToken', localCalendarAccessToken);
      if (!localCalendarAccessToken.access_token) {
        setCalendarAuthCode("");
        return
      }
      try {

        const { access_token, owner } = localCalendarAccessToken;

        let getEventTypesResponse = await ScheduleAPI.getEventTypes(owner, access_token);
        console.log({getEventTypesResponse});
        setMentorEventTypes(getEventTypesResponse.data.collection);
      }
      catch( getEventTypesResponseError: any) {
        console.log({getEventTypesResponseError});
        if(getEventTypesResponseError?.response?.data?.title === "Unauthenticated") {
          // if the response says the access token is unauthenticated, then clear the values in local storage
          setCalendarAccessToken({});
          localStorage.removeItem(calendarAccessTokenKeyName);
        }
      }
    }

    const getAccessToken =  async () => {

      try {
        let getCalendlyAccessTokenResponse = await ScheduleAPI.getCalendlyAccessToken(calendarAuthCode);
        console.log({getCalendlyAccessTokenResponse});
        const localCalendarAccessToken = getCalendlyAccessTokenResponse.data;
        setCalendarAccessToken(localCalendarAccessToken);
        localStorage.setItem(calendarAccessTokenKeyName, JSON.stringify(calendarAccessToken));
        return localCalendarAccessToken
      }
      catch( getCalendlyAccessTokenResponseError: any) {
        console.log({getCalendlyAccessTokenResponseError});
        if(getCalendlyAccessTokenResponseError?.response?.data?.error === "invalid_grant") {
          // if the response says the access token is unauthenticated, then clear the values in local storage
          setCalendarAccessToken({});
          setCalendarAuthCode("");
          return {}
        }
      }
    }

    const setMentorSchedule =  async (mentorEventType: any) => {
      try {
        console.log({mentorEventType});
        const setMentorScheduleResponse = await MentorshipAPI.patchMentor({mentor: {
          schedule_url: mentorEventType.scheduling_url,
          id: mentor.id,
        }});
        console.log({setMentorScheduleResponse});
      } catch (setMentorScheduleError: any) {
        console.log({setMentorScheduleError});
      }
    }

  console.log({mentorEventTypes});

  return (
    
    <div>

        <div className='text-center p-3 m-3'>
          {calendarAuthCode?

            <Button type="primary" onClick={getUserSchedule}>
                Get Available Events
            </Button> 
            :
            <a href={CALENDLY_AUTH_URL}>
                <Button type="primary">
                  Login To Calendly
                </Button>
            </a>
        
        }
        </div>

        <List
        header={
        <div>
          <h1>Available Events</h1><br/>  
          <a href='https://calendly.com/event_types/user/me' target="_blank" rel="noreferrer">
            Edit Calendar Events
          </a>
        </div>
        }
        bordered
        dataSource={mentorEventTypes}
        renderItem={mentorEventType => {
          const activeSchedule = mentor.schedule_url === mentorEventType.scheduling_url;
          let invalidEventType = `${mentorEventType.duration !== 60 ? "Event duration must be 60 minutes. ":""}${ !mentorEventType.active ? "Event must be active." : ""}`;
          return (
            <List.Item>
              <h3>
                {mentorEventType.name} {activeSchedule && <Tag color="green">Active Schedule</Tag>}
              </h3>
              
              {invalidEventType ? <p className='text-danger'>
                {invalidEventType}
              </p> :
              <Button type="primary" onClick={() => setMentorSchedule(mentorEventType)} disabled={activeSchedule||!!invalidEventType}>
                Set Mentorship Schedule
            </Button> }
            </List.Item>
          )
        }}
      />

    </div>
  )
}

export default withRouter(MentorScheduleEdit)
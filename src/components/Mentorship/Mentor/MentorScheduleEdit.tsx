import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router';
import Environment from '../../../services/Environment'
import ScheduleAPI from '../../../services/ScheduleAPI';

export const CALENDLY_AUTH_URL = `https://auth.calendly.com/oauth/authorize?client_id=${Environment.CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=https://atila.ca/profile`

interface RouteParams {pageId: string};

function MentorScheduleEdit(props: RouteComponentProps<RouteParams>) {
    
  const {location: {search}}  = props;
      
  const params = new URLSearchParams(search);
  let urlCalendarAuthCode = params.get('code');

  const [calendarAuthCode, setCalendarAuthCode] = useState(urlCalendarAuthCode || localStorage.getItem('calendarAuthCode')||'');

  const [calendarAccessToken, setCalendarAccessToken] = useState(localStorage.getItem('calendarAccessToken')||'');

  if (urlCalendarAuthCode) {
    localStorage.setItem('calendarAuthCode', urlCalendarAuthCode);
    setCalendarAuthCode(urlCalendarAuthCode);
  }


    useEffect(() => {
      if (calendarAuthCode) {
        getUserSchedule();
      }
    })

    const getUserSchedule =  async () => {

      let localCalendarAccessToken = calendarAccessToken;
      console.log('localCalendarAccessToken', localCalendarAccessToken);
      if (!localCalendarAccessToken) {
        let getCalendlyAccessTokenResponse = await ScheduleAPI.getCalendlyAccessToken(calendarAuthCode);
        console.log({getCalendlyAccessTokenResponse});
        localCalendarAccessToken = getCalendlyAccessTokenResponse.data.token;
        localStorage.setItem('calendarAccessToken', calendarAccessToken);
        setCalendarAccessToken(localCalendarAccessToken);
      } 
      let getEventTypesResponse = await ScheduleAPI.getEventTypes("me");
      console.log({getEventTypesResponse});
      console.log({getEventTypesResponse});
    }
    

  return (
    <div>
        {!calendarAuthCode && <a href={CALENDLY_AUTH_URL}>
            <Button type="primary">
                    Login To Calendly
            </Button>
        </a>}

        <Button type="primary" onClick={getUserSchedule}>
            Get Available Events
        </Button>
    </div>
  )
}

export default withRouter(MentorScheduleEdit)
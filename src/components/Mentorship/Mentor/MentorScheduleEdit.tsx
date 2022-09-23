/**
 * See: docs/mentorship/README.md
 */
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router';
import Environment from '../../../services/Environment'
import ScheduleAPI from '../../../services/ScheduleAPI';

export const CALENDLY_AUTH_URL = `https://auth.calendly.com/oauth/authorize?client_id=${Environment.CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=https://atila.ca/profile`

interface RouteParams {pageId: string};

const calendarAccessTokenKeyName = 'calendarAccessToken';
function MentorScheduleEdit(props: RouteComponentProps<RouteParams>) {
    
  const {location: {search}}  = props;
      
  const params = new URLSearchParams(search);

  console.log('params', params);
  console.log("(params.get('code')", params.get('code'));

  const [calendarAuthCode, setCalendarAuthCode] = useState(params.get('code') || '');
  const [calendarAccessToken, setCalendarAccessToken] = useState(JSON.parse(localStorage.getItem(calendarAccessTokenKeyName)||'{}'));
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
      let localCalendarAccessToken = calendarAccessToken.access_token ?  calendarAccessToken : await getAccessToken();
      console.log('localCalendarAccessToken', localCalendarAccessToken);
      if (!localCalendarAccessToken.access_token) {
        setCalendarAuthCode("");
        return
      }
      try {

        const { access_token, owner } = localCalendarAccessToken;
        const ownerUri = owner.split("/").pop();

        let getEventTypesResponse = await ScheduleAPI.getEventTypes(ownerUri, access_token);
        console.log({getEventTypesResponse});
      }
      catch( getUserResponseError: any) {
        console.log({getUserResponseError});
        if(getUserResponseError?.response?.data?.title === "Unauthenticated") {
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
    

  return (
    <div>
        {calendarAuthCode ?

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
  )
}

export default withRouter(MentorScheduleEdit)
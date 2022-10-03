# Mentorship


## Connecting a Mentor Schedule Using Calendly

1. Get `calendarAuthCode` from OAuth calendly API
2. Get `calendarAccessToken` from calendly API via atila-django
3. If `calendarAccessToken` is expired, clear `calendarAccessToken` and go back to step 1

1. OAuth is used to get an access code from the calendly API: User is redirected to the Calendly authorization login flow and the code is returned to atil.ca/profile?code=<calendarAuthCode> and saved to local storage
    1. `calendarAuthCode` is either retrieved from the URL or from local storage

2. The `calendarAuthCode` is then sent to the `atila-django` API and a `calendarAccessToken` is returned to `client-web-app` and saved to local storage.

3. The active user is retrieved from the API , using `calendarAccessToken` in the header and their userURI is saved to `Mentor.calendly_user_uri` and the user slug is saved to `Mentor.calendly_user_slug`

4. Subsequent requests such as retrieving event types and availability is  performed by sending API requests to api.calendly.com with the `accessToken` in the header and the `Mentor.calendly_user_uri`.
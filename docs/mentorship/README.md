# Mentorship


## Connecting a Mentor Schedule Using Calendly

1. OAuth is used to get an access code from the calendly API and the code is returned to atil.ca/profile?code=<calendly_auth_code>

2. The `calendly_auth_code` is then sent to the `atila-django` API and an `accessToken` is returned to `client-web-app`

3. The active user is retrieved from the API and their userURI is saved to `Mentor.calendly_user_uri`

4. Subsequent requests such as retrieving event types and availability is  performed by sending API requests to api.calendly.com with the `accessToken` in the header and the `Mentor.calendly_user_uri`.
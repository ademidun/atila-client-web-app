# Changelog

## September 12 2019
### Add Login, Register, User Authentication
https://github.com/ademidun/atila-client-web-app/pull/7

- Add components to register a new user and login a user
- After user logs in, authenticate using a JWT token that is returned from the backend and saved to local storage
- When user logs out, clear local storage token and remove authorization from each network request


## September 5 2019
### Move repo from public atilatech to private my account

- Move the folder from the public open source version on demo.atila.ca to my private version
- change deployment to use circleci and deploy to firebase (https://atila-7-staging.firebaseapp.com/)
 instead of aws s3 and demo.atila.ca
 
 
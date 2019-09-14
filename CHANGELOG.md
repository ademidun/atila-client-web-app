# Changelog

## September 14 2019
### Adding Redux to React App

- The dilemna I am facing now is if I should start decoupling my 
redux store into data and ui now similiar to how I have seen Recat apps built
in past projects (and use things like combine reducers).
- I tried to do that at first but:
1. I can't remember how it's done
2. It almost seems like a case of premature optimization

- I think I will just use the basic structure for now.
And write code in a good way so if I need to refactor, I
can do so easily.  

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
 
 
# Atila Client Web App

Client web app for atila.ca
https://atila.ca


[![CircleCI](https://circleci.com/gh/ademidun/atila-client-web-app.svg?style=svg&circle-token=7f1494d7537588626045fead3cab8d7d70c1bc38)](https://circleci.com/gh/ademidun/atila-client-web-app)

prod: [![Netlify Status](https://api.netlify.com/api/v1/badges/837e9c44-3040-4460-a90e-d93d4a49f54a/deploy-status)](https://app.netlify.com/sites/atila/deploys)

staging: [![Netlify Status](https://api.netlify.com/api/v1/badges/ed4f5b21-da47-4094-8e41-89e49a620f55/deploy-status)](https://app.netlify.com/sites/atila-staging/deploys)

## Getting Started

`npm install; npm start`

## Steps for Adding a new Item to Redux

Taken from [PR #8](https://github.com/ademidun/atila-client-web-app/pull/8/files)

- Go to `src/redux/reducers/data` and add a data item to a reducer in the respective `.js` file
- If you are creating a new reducer you will also need to add the reducer to `index.js` in `src/redux/reducers/data`


- For adding actions:
- Go to `src/redux/actions/<yourActionFile>.js` and add an action that will trigger that data item

- Then you can reference the redux state from `mapStateToProps()` and `state.data.user.loggedInUserProfile`
- If you are adding an action, you can do: `mapDispatchToProps()`
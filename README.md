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

## Testing

`npm test`

To test a specific file: `npm test -- SomeTestFileToRun` for example: `npm test -- Register`

## Mocking API Data

If you can't or don't want to use the actual backend API you can mock the responses, here's how:

Note: Here are two video tutorials we made specifically on how to Mock API Data in this project.
1. [How to Mock API Data in atila-client-web-app](https://www.loom.com/share/8405abef5585401ab0924e742fcb1fd9) 
1. [How to Mock API Data in atila-client-web-app based on the request](https://www.loom.com/share/367fe555b0584c28b6e68d1f0e5d121f)

<!-- Seperate the top list and the bottom list -->

1. Set `ATILA_MOCK_API_CALLS` to true in local storage.
    1. Right click in your browser > Inspect > Application.

1. Get the JSON response of the data you want to mock.
    1. This can usually be retrieved from staging.atila.ca and checking the network tap of the request using devtools. 
    1. Right click > Inspect > Network and filter by the api URL.
    1. Use [jsonformatter.com](https://jsonformatter.curiousconcept.com/#) to add tab spacing to make your JSON files easier to read and so it's not one one line
        1. Make sure to use a 4 space tab
    1. **Note:** Make sure you don't use production data containing private information for your mock data:
        1. For example, if you want to mock a list of applications or a user profile, ask someone else on the team to send your some mock data on their local dev environment and provide them with the url you are trying to mock

1. Copy that JSON response and put it into `src/services/mocks/{Object_name}/{File_name}.json` for example if you wanted to make a scholarship list response you would put it into `src/services/mocks/Scholarship/ScholarshipsPreview1.json` you might have to make a new directory if the object name you want to use doesn't exist.
    

1. Go to `MockAPI.initializeMocks()` to add the instructions for how to mock your new data.

We use [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) for our API mocking, see their documentation for how to do more advanced mocking such as returning a certain response based on the request parameters.

**Note:** You can only mock api calls in the dev environment.
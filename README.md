# Atila Client Web App

Client web app for atila.ca
https://atila.ca


[![CircleCI](https://circleci.com/gh/ademidun/atila-client-web-app.svg?style=svg&circle-token=7f1494d7537588626045fead3cab8d7d70c1bc38)](https://circleci.com/gh/ademidun/atila-client-web-app)

prod: [![Netlify Status](https://api.netlify.com/api/v1/badges/837e9c44-3040-4460-a90e-d93d4a49f54a/deploy-status)](https://app.netlify.com/sites/atila/deploys)

staging: [![Netlify Status](https://api.netlify.com/api/v1/badges/ed4f5b21-da47-4094-8e41-89e49a620f55/deploy-status)](https://app.netlify.com/sites/atila-staging/deploys)

## Getting Started

`npm install; npm start`

## Steps for Adding a new item to Redux

1. Create a new reducer in `reducers/data/<filename>.js` 
you can use userReducer in `reducers/data/user.js` as an example.
2. Add the reducer to `reducers/data/index.js`
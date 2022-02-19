export const EnvironmentDev = {
    name: 'dev',
    production: false,
    apiUrl: 'http://127.0.0.1:8000/api',
    //apiUrl: 'https://c3bff55a3fa0.ngrok.io/api',
    // apiUrlNotion: 'http://127.0.0.1:8787',
    apiUrlNotion: 'https://notion-api-worker.atila.workers.dev',
    apiUrlNodeMicroservice: 'http://127.0.0.1:9000',
    apiUrlBillingMicroservice: 'http://127.0.0.1:9001',
    apiUrlRecommender: 'http://127.0.0.1:5000',
    apiUrlEmailService: 'http://127.0.0.1:5001',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
    ALGOLIA_PUBLIC_KEY: '0bd3e798b8330dc08ba51ab519fd35e7',
    ALGOLIA_APP_ID: 'HH66ESLTOR',
    clientUrl: 'http://localhost:3000',
    isDemoMode: false,
};

export const EnvironmentStaging = {
    name: 'staging',
    production: false,
    apiUrl: 'https://atila-7-staging.herokuapp.com/api',
    apiUrlNotion: 'https://notion-api-worker.atila.workers.dev',
    apiUrlNodeMicroservice: 'https://tgrr8bis30.execute-api.us-east-1.amazonaws.com/staging',
    apiUrlBillingMicroservice: 'https://noitlizkka.execute-api.us-east-1.amazonaws.com/staging',
    apiUrlRecommender: 'https://ioqtbeqgob.execute-api.us-east-1.amazonaws.com/staging',
    apiUrlEmailService: 'https://mhc9n9h5pe.execute-api.us-east-1.amazonaws.com/staging',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
    ALGOLIA_PUBLIC_KEY: '0bd3e798b8330dc08ba51ab519fd35e7',
    ALGOLIA_APP_ID: 'HH66ESLTOR',
    clientUrl: 'https://staging.atila.ca',
    isDemoMode: false,
};

export const EnvironmentDemo = {
    ...EnvironmentStaging,
    name: "demo",
    clientUrl: 'https://demo.atila.ca',
    isDemoMode: true,
}

export const EnvironmentProd = {
    name: 'prod',
    production: true,
    apiUrl: 'https://atila-7.herokuapp.com/api',
    apiUrlNotion: 'https://notion-api-worker.atila.workers.dev',
    apiUrlNodeMicroservice: 'https://yhpl8yynpk.execute-api.us-east-1.amazonaws.com/prod',
    apiUrlBillingMicroservice: 'https://eiqnyq1jx6.execute-api.us-east-1.amazonaws.com/prod',
    apiUrlRecommender: 'https://itt9ynrcpb.execute-api.us-east-1.amazonaws.com/prod',
    apiUrlEmailService: 'https://kho47lpiuf.execute-api.us-east-1.amazonaws.com/prod',
    STRIPE_PUBLIC_KEY: 'pk_live_AgHuMdhPDSk5eKrlwoHCnZnR00uIrfIHkM',
    ALGOLIA_PUBLIC_KEY: '0bd3e798b8330dc08ba51ab519fd35e7',
    ALGOLIA_APP_ID: 'HH66ESLTOR',
    clientUrl: 'https://atila.ca',
    isDemoMode: false,
};

// set to EnvironmentDev as the default so we can use type hinting and the autocomplete feature
let Environment = EnvironmentDev;

if (window.location.host.includes('localhost')) {
    Environment = EnvironmentDev;
} else if (window.location.host.includes('staging')) {
    Environment = EnvironmentStaging;
} else if (window.location.host.includes('demo')) {
    Environment = EnvironmentDemo;
}
else if(window.location.host.includes('atila.ca')){
    Environment =  EnvironmentProd;
}

if (!Environment.apiUrl) {
    console.warn('Environment.apiUrl is not found')
}
if (!Environment.apiUrlNodeMicroservice) {
    console.warn('Environment.apiUrlNodeMicroservice is not found')
}

export default Environment;

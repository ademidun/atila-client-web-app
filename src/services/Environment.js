export const EnvironmentDev = {
    name: 'dev',
    production: false,
    //apiUrl: 'http://127.0.0.1:8000/api',
    apiUrl: 'https://3d97528d9c0c.ngrok.io/api',
    apiUrlNodeMicroservice: 'http://127.0.0.1:9000',
    apiUrlBillingMicroservice: 'http://127.0.0.1:9001',
    apiUrlRecommender: 'http://127.0.0.1:5000',
    apiUrlEmailService: 'http://127.0.0.1:5001',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
};

export const EnvironmentStaging = {
    name: 'staging',
    production: false,
    apiUrl: 'https://atila-7-staging.herokuapp.com/api',
    apiUrlNodeMicroservice: 'https://tgrr8bis30.execute-api.us-east-1.amazonaws.com/staging',
    apiUrlBillingMicroservice: 'https://noitlizkka.execute-api.us-east-1.amazonaws.com/staging',
    apiUrlRecommender: 'https://ioqtbeqgob.execute-api.us-east-1.amazonaws.com/staging',
    apiUrlEmailService: 'https://mhc9n9h5pe.execute-api.us-east-1.amazonaws.com/staging',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
};

export const EnvironmentProd = {
    name: 'prod',
    production: true,
    apiUrl: 'https://atila-7.herokuapp.com/api',
    apiUrlNodeMicroservice: 'https://yhpl8yynpk.execute-api.us-east-1.amazonaws.com/prod',
    apiUrlBillingMicroservice: 'https://eiqnyq1jx6.execute-api.us-east-1.amazonaws.com/prod',
    apiUrlRecommender: 'https://itt9ynrcpb.execute-api.us-east-1.amazonaws.com/prod',
    apiUrlEmailService: 'https://kho47lpiuf.execute-api.us-east-1.amazonaws.com/prod',
    STRIPE_PUBLIC_KEY: 'pk_live_AgHuMdhPDSk5eKrlwoHCnZnR00uIrfIHkM',
};

let Environment = {};

if (window.location.host.includes('localhost')) {
    Environment = EnvironmentDev;
} else if (window.location.host.includes('staging')) {
    Environment = EnvironmentStaging;
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

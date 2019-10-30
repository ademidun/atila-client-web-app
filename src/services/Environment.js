export const EnvironmentDev = {
    name: 'dev',
    production: false,
    apiUrl: 'http://127.0.0.1:8000/api',
    apiUrlNodeMicroservice: 'http://127.0.0.1:9000',
    apiUrlBillingMicroservice: 'http://127.0.0.1:9001',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
};

export const EnvironmentStaging = {
    name: 'staging',
    production: false,
    apiUrl: 'https://atila-7-staging.herokuapp.com/api',
    apiUrlNodeMicroservice: 'https://tgrr8bis30.execute-api.us-east-1.amazonaws.com/staging',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
};

export const EnvironmentProd = {
    name: 'prod',
    production: true,
    apiUrl: 'https://atila-7.herokuapp.com/api',
    apiUrlNodeMicroservice: 'https://yhpl8yynpk.execute-api.us-east-1.amazonaws.com/prod',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
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
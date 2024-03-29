export const EnvironmentDev = {
    name: 'dev',
    production: false,
    apiUrl: 'http://127.0.0.1:8000/api',
    //apiUrl: 'https://c3bff55a3fa0.ngrok.io/api',
    // apiUrlNotion: 'http://127.0.0.1:8787', // use prod API by default since this is mostly a read-only API and dev is rarely used
    apiUrlNotion: 'https://notion-api-worker.atila.workers.dev',
    apiUrlNodeMicroservice: 'http://127.0.0.1:9000',
    apiUrlBillingMicroservice: 'http://127.0.0.1:9001',
    apiUrlRecommender: 'http://127.0.0.1:5000',
    apiUrlEmailService: 'http://127.0.0.1:5001',
    STRIPE_PUBLIC_KEY: 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM',
    ALGOLIA_PUBLIC_KEY: '0bd3e798b8330dc08ba51ab519fd35e7',
    ALGOLIA_APP_ID: 'HH66ESLTOR',
    CALENDLY_CLIENT_ID: 'YGxuYb7-9tV_PYR7Da9-a1BonREDJJSTg8XB1kdL5pY',
    ALGOLIA_SCHOLARSHIP_INDEX: 'dev_scholarship_index',
    ALGOLIA_BLOG_INDEX: 'dev_blog_index',
    ALGOLIA_MENTOR_INDEX: 'dev_mentor_index',
    ALGOLIA_SCHOLARSHIP_QUERY_SUGGESTION_INDEX_NAME: 'dev_scholarship_index_query_suggestions',
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
    ALGOLIA_SCHOLARSHIP_QUERY_SUGGESTION_INDEX_NAME: 'staging_scholarship_index_query_suggestions',
    ALGOLIA_SCHOLARSHIP_INDEX: 'staging_scholarship_index',
    ALGOLIA_BLOG_INDEX: 'staging_blog_index',
    ALGOLIA_MENTOR_INDEX: 'staging_mentor_index',
    clientUrl: 'https://staging.atila.ca',
    CALENDLY_CLIENT_ID: 'YGxuYb7-9tV_PYR7Da9-a1BonREDJJSTg8XB1kdL5pY',
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
    ALGOLIA_SCHOLARSHIP_QUERY_SUGGESTION_INDEX_NAME: 'prod_scholarship_index_query_suggestions',
    ALGOLIA_SCHOLARSHIP_INDEX: 'prod_scholarship_index',
    ALGOLIA_BLOG_INDEX: 'prod_blog_index',
    ALGOLIA_MENTOR_INDEX: 'prod_mentor_index',
    clientUrl: 'https://atila.ca',
    CALENDLY_CLIENT_ID: 'YGxuYb7-9tV_PYR7Da9-a1BonREDJJSTg8XB1kdL5pY',
    isDemoMode: false,
};

// set to EnvironmentDev as the default so we can use type hinting and the autocomplete feature
let Environment = EnvironmentDev;

console.log('window.location.host', window.location.host)
if (window.location.host.includes('localhost')) {
    Environment = EnvironmentDev;
} else if (window.location.host.includes('staging')) {
    Environment = EnvironmentStaging;
} else if (window.location.host.includes('gitpod.io')) {
    Environment = EnvironmentDev;
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

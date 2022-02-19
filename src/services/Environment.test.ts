import React from 'react';
import {EnvironmentDemo, EnvironmentDev, EnvironmentProd, EnvironmentStaging} from "./Environment";

describe('Environment', () => {

    it('renders the correct environment name', () => {
        expect(EnvironmentDev.name).toBe('dev');
        expect(EnvironmentStaging.name).toBe('staging');
        expect(EnvironmentDemo.name).toBe('demo');
        expect(EnvironmentProd.name).toBe('prod');
    });

    it('renders the correct isDemoMode', () => {
        expect(EnvironmentDev.isDemoMode).toBe(false);
        expect(EnvironmentStaging.isDemoMode).toBe(false);
        expect(EnvironmentDemo.isDemoMode).toBe(true);
        expect(EnvironmentProd.isDemoMode).toBe(false);
    });

    it('renders the correct api url', () => {

        for (let prop in EnvironmentDev) {
            if (Object.prototype.hasOwnProperty.call(EnvironmentDev, prop)) {
                if (prop.toLowerCase().includes('api')) {
                    expect((EnvironmentDev as any)[prop].startsWith('http://127.0.0.1:')).toBeTruthy();
                }
            }
        }

        for (let prop in EnvironmentStaging) {
            if (Object.prototype.hasOwnProperty.call(EnvironmentStaging, prop)) {

                const propValue = (EnvironmentStaging as any)[prop];
                if (prop.toLowerCase().includes('api') && prop !== "apiUrlNotion") {
                    expect(propValue).toContain('staging');
                }

                if (typeof propValue === 'string' && propValue.toLowerCase().includes('.execute-api.')) {
                    expect(propValue.endsWith('/staging')).toBeTruthy();
                }
            }
        }

        for (let prop in EnvironmentProd) {
            if (Object.prototype.hasOwnProperty.call(EnvironmentProd, prop)) {

                const propValue = (EnvironmentProd as any)[prop];
                if (prop.toLowerCase().includes('api')) {
                    expect(propValue).not.toContain('127.0.0.1');
                    expect(propValue).not.toContain('staging');
                }
                if (typeof propValue === 'string' && propValue.toLowerCase().includes('.execute-api.')) {
                    expect(propValue.endsWith('/prod')).toBeTruthy();
                }
            }
        }

        expect(EnvironmentProd.apiUrl)
            .toContain('atila-7.herokuapp.com');
        expect(EnvironmentProd.apiUrlNodeMicroservice)
            .toContain('yhpl8yynpk.execute-api.us-east-1.amazonaws.com/prod');
    });

    it('renders the correct STRIPE_PUBLIC_KEY', () => {
        const stripePublicKeyTest = 'pk_test_AxhlK7IudWRlQCa4azz4WElP00QVVE6SNM';

        const stripePublicKeyProduction = 'pk_live_AgHuMdhPDSk5eKrlwoHCnZnR00uIrfIHkM';

        expect(EnvironmentDev.STRIPE_PUBLIC_KEY)
            .toContain(stripePublicKeyTest);

        expect(EnvironmentStaging.STRIPE_PUBLIC_KEY)
            .toContain(stripePublicKeyTest);

        expect(EnvironmentProd.STRIPE_PUBLIC_KEY)
            .toContain(stripePublicKeyProduction);
    });


    it('renders the correct billing api url', () => {
        const stagingBilingUrl = 'noitlizkka.execute-api.us-east-1.amazonaws.com';
        const prodBilingUrl = 'eiqnyq1jx6.execute-api.us-east-1.amazonaws.com/prod';

        expect(EnvironmentDev.apiUrlBillingMicroservice)
            .toContain('127.0.0.1:9001');
        expect(EnvironmentStaging.apiUrlBillingMicroservice)
            .toContain(stagingBilingUrl);
        expect(EnvironmentProd.apiUrlBillingMicroservice)
            .toContain(prodBilingUrl);
    });

    it('should not end with a trailing slash', () =>{

        const environments = [EnvironmentDev, EnvironmentStaging, EnvironmentProd];

        environments.forEach(environment => {
            for (let prop in environment) {
                if (Object.prototype.hasOwnProperty.call(environment, prop)) {
                    if (prop.toLowerCase().includes('api')) {
                        expect((environment as any)[prop].endsWith('/')).toBe(false);
                    }
                }
            }
        });
    });
});
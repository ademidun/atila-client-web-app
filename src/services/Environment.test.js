import React from 'react';
import {EnvironmentDev, EnvironmentProd, EnvironmentStaging} from "./Environment";

it('renders the correct api url', () => {

    for (let prop in EnvironmentDev) {
        if (Object.prototype.hasOwnProperty.call(EnvironmentDev, prop)) {
            if (prop.toLowerCase().includes('api')) {
                expect(EnvironmentDev[prop]).toContain('127.0.0.1');
            }
        }
    }

    for (let prop in EnvironmentStaging) {
        if (Object.prototype.hasOwnProperty.call(EnvironmentDev, prop)) {
            if (prop.toLowerCase().includes('api')) {
                expect(EnvironmentStaging[prop]).toContain('staging');
            }
        }
    }

    for (let prop in EnvironmentProd) {
        if (Object.prototype.hasOwnProperty.call(EnvironmentDev, prop)) {
            if (prop.toLowerCase().includes('api')) {
                expect(EnvironmentProd[prop]).not.toContain('127.0.0.1');
                expect(EnvironmentProd[prop]).not.toContain('staging');
            }
        }
    }

    expect(EnvironmentProd.apiUrl)
        .toContain('atila-7.herokuapp.com');
    expect(EnvironmentProd.apiUrlNodeMicroservice)
        .toContain('yhpl8yynpk.execute-api.us-east-1.amazonaws.com/prod');
});

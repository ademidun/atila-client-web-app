import React from 'react';
import AnalyticsService from "./AnalyticsService";
import {ScholarshipEngineering} from "../models/Scholarship";
import {UserProfileTest1} from "../models/UserProfile";

jest.mock('./utils', () => {
    return {
        makeXHRRequestAsPromise: () => Promise.reject({
            status: 400,
            statusText: '',
            response: {error: 'Mocking XHR'},
        }),
        getItemType: (item) => 'scholarship',
        getGuestUserId: () => 'randomGuestUserId123',
    }
});
describe('AnalyticsService', () => {

    describe('AnalyticsService.transformViewData()', () => {

        it('includes item_name and item_id for scholarship', async () => {

            const transformedViewData = await AnalyticsService.transformViewData(ScholarshipEngineering);
            console.log({transformedViewData});

            expect(transformedViewData.item_name).toEqual(ScholarshipEngineering.name);
            expect(transformedViewData.item_id).toEqual(ScholarshipEngineering.id);
            expect(transformedViewData.geo_ip).toBeTruthy();
        });

        it('includes user_id for scholarship if userProfile is not null', async () => {

            const transformedViewData = await
                AnalyticsService.transformViewData(ScholarshipEngineering, UserProfileTest1);
            console.log({transformedViewData});

            expect(transformedViewData.user_id).toEqual(UserProfileTest1.id);
            expect(transformedViewData.is_owner).toEqual(true);
        });

    });
});
import React from 'react';
import AnalyticsService from "./AnalyticsService";
import {ScholarshipEngineering} from "../models/Scholarship";
import {UserProfileTest1} from "../models/UserProfile";
import {SEARCH_ANALYTICS_RESULTS_ENGINEERING, SEARCH_ANALYTICS_RESULTS_SCHOLARSHIP} from "../models/Constants";

jest.mock('./utils', () => {
    return {
        ...(jest.requireActual('./utils')),
        makeXHRRequestAsPromise: () => Promise.reject({
            status: 400,
            statusText: '',
            response: {error: 'Mocking XHR'},
        }),
        getGuestUserId: () => 'randomGuestUserId123',
    }
});
describe('AnalyticsService', () => {

    describe('AnalyticsService.transformViewData()', () => {

        it('includes item_name and item_id for scholarship', async () => {

            const transformedViewData = await AnalyticsService.transformViewData(ScholarshipEngineering);

            expect(transformedViewData.item_name).toEqual(ScholarshipEngineering.name);
            expect(transformedViewData.item_id).toEqual(ScholarshipEngineering.id);
            expect(transformedViewData.geo_ip).toBeTruthy();
        });

        it('includes user_id for scholarship if userProfile is not null', async () => {

            const transformedViewData = await
                AnalyticsService.transformViewData(ScholarshipEngineering, UserProfileTest1);

            expect(transformedViewData.user_id).toEqual(UserProfileTest1.id);
            expect(transformedViewData.is_owner).toEqual(true);
        });

    });


    describe('AnalyticsService.transformSearchAnalytics()', () => {

        it('includes geo_ip, user_id_guest and search_results', async () => {

            const transformedData = await
                AnalyticsService.transformSearchAnalytics(
                    {search_results: SEARCH_ANALYTICS_RESULTS_SCHOLARSHIP});

            expect(transformedData.search_results.search_payload.searchString)
                .toEqual(SEARCH_ANALYTICS_RESULTS_SCHOLARSHIP.search_payload.searchString);
            expect(transformedData.geo_ip).toBeTruthy();
            expect(transformedData.user_id_guest).toBeTruthy();
            expect(transformedData.is_guest).toBeTruthy();
        });

        it('includes geo_ip, user_id and search_results', async () => {

            const transformedData = await
                AnalyticsService.transformSearchAnalytics(
                    {search_results: SEARCH_ANALYTICS_RESULTS_ENGINEERING},
                    UserProfileTest1);

            expect(transformedData.user_id).toEqual(UserProfileTest1.id);

            expect(transformedData.search_results.searchQuery)
                .toEqual(SEARCH_ANALYTICS_RESULTS_ENGINEERING.searchQuery);
            expect(transformedData.is_owner).toBeFalsy();
            expect(transformedData.geo_ip).toBeTruthy();
            expect(transformedData.is_guest).toBeFalsy();
        });

    });
});
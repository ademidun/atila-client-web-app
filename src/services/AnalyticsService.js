import Environment from "./Environment";
import request from "axios";
import {getGuestUserId, getItemType, makeXHRRequestAsPromise} from "./utils";
import {IP_GEO_LOCATION_URL} from "../models/Constants";

class AnalyticsService {

    static pageViewsUrl = `${Environment.apiUrlNodeMicroservice}/page-views`;
    static searchAnalyticsUrl = `${Environment.apiUrlNodeMicroservice}/search-analytics`;
    static savePageView = async (viewData, userProfile) => {

        const viewDataBody = await AnalyticsService.transformViewData(viewData, userProfile);
        const apiCompletionPromise = request({
            method: 'post',
            data: viewDataBody,
            url: `${AnalyticsService.pageViewsUrl}`,
        });

        return apiCompletionPromise;
    };
    static getPageViews = (userId) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${AnalyticsService.pageViewsUrl}?user=${userId}`,
        });

        return apiCompletionPromise;
    };
    static saveSearchAnalytics = async (searchAnalytics, userProfile) => {

        const searchAnalyticsBody = await AnalyticsService.transformSearchAnalytics(searchAnalytics, userProfile);
        const apiCompletionPromise = request({
            method: 'post',
            data: searchAnalyticsBody,
            url: `${AnalyticsService.searchAnalyticsUrl}`,
        });

        return apiCompletionPromise;
    };


    static transformSearchAnalytics = async (inputData, userProfile) => {


        let transformedData = {
            ...inputData,
            geo_ip: null,
            useragent: navigator && navigator.userAgent,
            referrer: document && document.referrer,
            location: window && window.location.href,
        };
        if (!userProfile) {
            transformedData = {
                ...transformedData,
                user_id_guest: getGuestUserId(),
                is_guest: true
            };
        } else {
            transformedData = {
                ...transformedData,
                user_id: userProfile.user,
            };

            let guestUserId = localStorage.getItem('guestUserId');
            if (guestUserId) {
                transformedData.user_id_guest = guestUserId
            }
        }

        transformedData.geo_ip = await AnalyticsService.getGeoIp();

        return transformedData;
    };

    static transformViewData = async (viewData, userProfile) => {


        let transformedViewData = {
            item_type: getItemType(viewData),
            item_id: viewData.id,
            item_name: null,
            geo_ip: null,
            useragent: navigator && navigator.userAgent,
            referrer: document && document.referrer,
        };
        if (!userProfile) {
            transformedViewData = {
                ...transformedViewData,
                user_id_guest: getGuestUserId(),
                is_owner: false,
                is_guest: true
            };
        } else {
            transformedViewData = {
                ...transformedViewData,
                user_id: userProfile.user,
                is_owner: !!(viewData.user && viewData.user.id === userProfile.user)
            };

            let guestUserId = localStorage.getItem('guestUserId');
            if (guestUserId) {
                transformedViewData.user_id_guest = guestUserId
            }
        }

        transformedViewData.geo_ip = await AnalyticsService.getGeoIp();

        switch (transformedViewData.item_type) {

            case 'scholarship':
                transformedViewData.item_name = viewData.name;
                transformedViewData.is_owner = !!(userProfile && viewData.owner === userProfile.user);
                break;
            case 'essay':
                transformedViewData.item_name = viewData.title;
                break;
            case 'blog':
                transformedViewData.item_name = viewData.title;
                break;
            default:
                break;
        }

        return transformedViewData;
    };

    static getGeoIp = async (url=IP_GEO_LOCATION_URL) => {

        if (window.location.hostname === 'localhost') {
            return {
                error: 'Skip AnalyticsService.getGeoIp() in localhost to stay within quota limit. ' +
                    'Uncomment this line in AnalyticsService to test in localhost'
            }
        }

        const dropFields = ['currency', 'emoji_flag', 'emoji_unicode', 'flag', 'languages'];
        let geo_ip = {};

        try {
            geo_ip = await makeXHRRequestAsPromise('GET',
                url, {});
            geo_ip = JSON.parse(geo_ip);

            dropFields.forEach(field => {
                delete geo_ip[field];
            });
        } catch (err) {
            geo_ip['error'] = err;
        }
        return geo_ip
    }

}

export default AnalyticsService;
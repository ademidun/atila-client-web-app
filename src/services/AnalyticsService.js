import Environment from "./Environment";
import request from "axios";
import {getGuestUserId, getItemType, makeXHRRequestAsPromise} from "./utils";
const GEO_IP_URL = 'https://api.ipgeolocation.io/ipgeo?apiKey=defa481e93f84d4196dbf19426ab0c51__FOOBAR';

class AnalyticsService {

    static pageViewsUrl = `${Environment.apiUrlNodeMicroservice}/page-views`;
    static async savePageView(viewData, userProfile) {

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


    static async transformViewData(viewData, userProfile) {


        let transformedViewData = {
            item_type: getItemType(viewData),
            item_id: viewData.id,
            item_name: null,
            geo_ip: null,
        };
        if (!userProfile) {
            transformedViewData = {
                user_id: getGuestUserId(),
                is_owner: false,
                is_guest: true
            };
        } else {
            transformedViewData = {
                user_id: userProfile.user,
                is_owner: !!(viewData.user && viewData.user.id === userProfile.user)
            };

            let guestUserId = localStorage.getItem('guestUserId');
            if (guestUserId) {
                transformedViewData.user_id_guest = guestUserId
            }
        }

        transformedViewData.geo_ip = await AnalyticsService.getGeoIp();
        console.log({transformedViewData});

        switch (transformedViewData.item_type) {

            case 'scholarship':
                transformedViewData.item_name = viewData.name;
                transformedViewData.is_owner = (userProfile && viewData.owner === userProfile.user);
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

    static async getGeoIp() {

        let geo_ip = {};
        try {
            geo_ip = await makeXHRRequestAsPromise('GET',
                GEO_IP_URL, {});
            geo_ip = JSON.parse(geo_ip);
            console.log({geo_ip});
        } catch (err) {
            console.log({err});
            geo_ip['error'] = err;
        }
        console.log({geo_ip});
        return geo_ip
    }

}

export default AnalyticsService;
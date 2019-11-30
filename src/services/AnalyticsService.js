import Environment from "./Environment";
import request from "axios";
import {getGuestUserId, getItemType, makeXHRRequestAsPromise} from "./utils";
const IPDATA_URL = 'https://api.ipdata.co/?api-key=335beb2ad17cc12676f2792328a5a770c47b89d6768daf9ec2c4d866';
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
            useragent: navigator && navigator.userAgent
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

        const dropFields = ['currency', 'emoji_flag', 'emoji_unicode', 'flag', 'languages'];
        let geo_ip = {};
        try {
            geo_ip = await makeXHRRequestAsPromise('GET',
                IPDATA_URL, {});
            geo_ip = JSON.parse(geo_ip);

            dropFields.forEach(field => {
                delete geo_ip[field];
            });

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
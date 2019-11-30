import Environment from "./Environment";
import request from "axios";
import {getGuestUserId, getItemType} from "./utils";
class AnalyticsService {

    static pageViewsUrl = `${Environment.apiUrlNodeMicroservice}/page-views`;
    static savePageView = (viewData, userProfile) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: AnalyticsService.transformViewData(viewData, userProfile),
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


    static transformViewData = (viewData, userProfile) => {


        let transformedViewData = {
            item_type: getItemType(viewData),
            item_id: viewData.id,
            item_name: null,
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
    }

}

export default AnalyticsService;
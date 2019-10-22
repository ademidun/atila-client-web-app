import Environment from "./Environment";
import request from "axios";
import {getItemType} from "./utils";
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
            user_id: userProfile.user,
            item_type: getItemType(viewData),
            item_id: viewData.id,
            item_name: null,
            is_owner: !!(viewData.user && viewData.user.id === userProfile.user)
        };

        switch (transformedViewData.item_type) {

            case 'scholarship':
                transformedViewData.item_name = viewData.name;
                transformedViewData.is_owner = (viewData.owner === userProfile.user);
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
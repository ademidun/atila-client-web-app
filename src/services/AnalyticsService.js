import Environment from "./Environment";
import request from "axios";
class AnalyticsService {

    static pageViewsUrl = `${Environment.atilaMicroservicesNodeApiUrl}/page-views`;
    static savePageViews = (viewData) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: viewData,
            url: `${AnalyticsService.pageViewsUrl}`,
        });

        return apiCompletionPromise;
    };

}

export default AnalyticsService;
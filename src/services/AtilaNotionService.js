import Environment from "./Environment";
import request from "axios";

class AnalyticsService {

    static pageIdUrl = `${Environment.apiUrlNodeMicroservice}/page-id`;

    static getPageId = (pageId) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${AnalyticsService.pageIdUrl}?id=${pageId}`,
        });

        return apiCompletionPromise;
    };
}
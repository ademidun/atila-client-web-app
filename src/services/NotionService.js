import Environment from "./Environment";
import request from "axios";

class NotionService {

    static pageIdUrl = `${Environment.apiUrlNotion}/v1/page`;

    static getPageId = (pageId) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${NotionService.pageIdUrl}/${pageId}`,
        });

        return apiCompletionPromise;
    };
}

export default NotionService;
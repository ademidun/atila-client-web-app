import Environment from "./Environment";
import request from "axios";

class NotionService {

    static pageIdUrl = `${Environment.apiUrlNodeMicroservice}/notion/get-page/`;

    static getPageId = (pageId) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${NotionService.pageIdUrl}?id=${pageId}`,
        });

        return apiCompletionPromise;
    };
}
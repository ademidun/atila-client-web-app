import {makeXHRRequestAsPromise} from "./utils";

class UtilsAPI {

    static sendContactUsForm = (formData) => {
        const url = "https://scriptd.goddsogle.com/macros/s/AKfycbw4p2mFV_gCMvrmqj1lD372FtO6owagphSOHoCa/exec";

        return makeXHRRequestAsPromise('POST', url, formData)
    };
}

export default UtilsAPI;
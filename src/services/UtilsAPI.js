import {makeXHRRequestAsPromise} from "./utils";
class UtilsAPI {

    static sendContactUsForm = (formData) => {
        const url = "https://script.google.com/macros/s/AKfycbyXvhP_6VQWYI-BMetdwDKqyndhOwpx841YzOvW0OaAcdlwFwM/exec";

        return makeXHRRequestAsPromise('POST', url, formData)
    };
}

export default UtilsAPI;
import {getGuestUserId, makeXHRRequestAsPromise} from "./utils";
import request from "axios";
class UtilsAPI {

    static postGoogleScript = (formData) => {
        const url = "https://script.google.com/macros/s/AKfycbyXvhP_6VQWYI-BMetdwDKqyndhOwpx841YzOvW0OaAcdlwFwM/exec";

        formData.guestUserId = getGuestUserId();
        return makeXHRRequestAsPromise('POST', url, formData)
    };

    static loadContent = (ContentClass) => {

        const { ContentAPI } = ContentClass.props;
        const { match : { params : { slug, username }} } = ContentClass.props;

        ContentAPI.getSlug(`${username}/${slug}`)
            .then(res => {
                if (res.data.blog) {
                    ContentClass.setState({content: res.data.blog});
                }
                else if( res.data.essay) {
                    ContentClass.setState({content: res.data.essay});
                }
            })
            .catch(err => {
                ContentClass.setState({contentGetError: { err }});
            })
            .finally(() => {
            });
    };

    static sendEbookPreviewEmail = (formData) => {

        const apiCompletionPromise = request({
            method: 'POST',
            data: formData,
            url: `http://127.0.0.1:5000/send-ebook-preview-email`,
        });

        return apiCompletionPromise;

    }
}

export default UtilsAPI;
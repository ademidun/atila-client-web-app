import {getGuestUserId, makeXHRRequestAsPromise} from "./utils";
import request from "axios";
import Environment from "./Environment";
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
                ContentClass.setState({isLoading: false});
            });
    };

    static loadNotionContent = (pageId) => {

        const apiCompletionPromise = request({
            method: 'GET',
            url: `https://notion-api.splitbee.io/v1/page/${pageId}`,
        });

        return apiCompletionPromise;
    };

    static sendEbookPreviewEmail = (formData) => {

        const apiCompletionPromise = request({
            method: 'POST',
            data: formData,
            url: `${Environment.apiUrlEmailService}/send-ebook-preview-email`,
        });

        return apiCompletionPromise;

    }

    static authenticateEbookUser = (email, licenseKey) => {

        const apiCompletionPromise = request({
            method: 'POST',
            data: {email, license_key: licenseKey},
            url: `${Environment.apiUrlEmailService}/ebook/authenticate-user`,
        });

        return apiCompletionPromise;

    }
}

export default UtilsAPI;
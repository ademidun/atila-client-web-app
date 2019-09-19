import {makeXHRRequestAsPromise} from "./utils";
class UtilsAPI {

    static sendContactUsForm = (formData) => {
        const url = "https://script.google.com/macros/s/AKfycbyXvhP_6VQWYI-BMetdwDKqyndhOwpx841YzOvW0OaAcdlwFwM/exec";

        return makeXHRRequestAsPromise('POST', url, formData)
    };

    static loadContent = (ContentClass) => {

        console.log({ContentClass});

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
    }
}

export default UtilsAPI;
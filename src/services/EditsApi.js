import request from "axios";
import Environment from './Environment'

class EditsAPI {
    static EditsAPIUrl = `${Environment.apiUrl}/edit`;

    static suggestEdit = (object_type, object_id, edit_data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data: {object_type, object_id, edit_data},
            url: `${EditsAPI.EditsAPIUrl}/edits/suggest-edit/`,
        });

        return apiCompletionPromise;
    };
}

export default EditsAPI

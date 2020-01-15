import {UPDATE_SCHOLARSHIP_CURRENTLY_EDITING} from "../../actions/scholarship";

const initialState = {
    scholarshipCurrentlyEditing: null
};

export default function scholarshipReducer(state = initialState, action) {
    if (action.type === UPDATE_SCHOLARSHIP_CURRENTLY_EDITING) {
        return Object.assign({}, state, {
            scholarshipCurrentlyEditing: action.payload
        });
    } else {
        return state
    }
}
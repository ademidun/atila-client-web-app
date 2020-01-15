import {SET_SCHOLARSHIP_CURRENTLY_EDITING, UPDATE_SCHOLARSHIP_CURRENTLY_EDITING} from "../../actions/user";

const initialState = {
    scholarshipCurrentlyEditing: null
};

export default function scholarshipReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SCHOLARSHIP_CURRENTLY_EDITING:
            return Object.assign({}, state, {
                scholarshipCurrentlyEditing: action.payload
            });
        case UPDATE_SCHOLARSHIP_CURRENTLY_EDITING:
            return Object.assign({}, state, {
                scholarshipCurrentlyEditing: action.payload
            });
        default:
            return state
    }
}
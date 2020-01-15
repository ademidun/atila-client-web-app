import {UPDATE_SCHOLARSHIP_CURRENTLY_EDITING} from "../../actions/scholarship";
import {defaultScholarship} from "../../../models/Scholarship";

const initialState = {
    scholarshipCurrentlyEditing: defaultScholarship
};

export default function scholarshipReducer(state = initialState, action) {
    if (action.type === UPDATE_SCHOLARSHIP_CURRENTLY_EDITING) {
        return {
            ...state,
            scholarshipCurrentlyEditing: {...action.payload}
        } ;
    } else {
        return state
    }
}
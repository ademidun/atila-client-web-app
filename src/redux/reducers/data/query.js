import { getDefaultQueryItem } from "../../../components/Query/QueryBuilderHelper";
import {
    UPDATE_CURRENT_USER_PROFILE_QUERY,
} from "../../actions/query";

const initialState = {
    currentUserProfileQuery: [getDefaultQueryItem()],
};

export default function queryReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_CURRENT_USER_PROFILE_QUERY:
            return Object.assign({}, state, {
                currentUserProfileQuery: action.payload
            });
        default:
            return state
    }
}

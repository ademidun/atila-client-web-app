import {
    SET_IS_FINISHED_LOADING_LOGGED_IN_USER_PROFILE_GET,
    SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET
} from "../../actions/user";

const initialState = {
    isLoadingLoggedInUserProfile: false,
    isFinishedLoadingLoggedInUserProfile: false,
};

export default function uiReducer(state = initialState, action) {
    switch (action.type) {
        case SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET:
            return Object.assign({}, state, {
                isLoadingLoggedInUserProfile: action.payload
            });
        case SET_IS_FINISHED_LOADING_LOGGED_IN_USER_PROFILE_GET:
            return Object.assign({}, state, {
                isFinishedLoadingLoggedInUserProfile: action.payload
            });
        default:
            return state
    }
}
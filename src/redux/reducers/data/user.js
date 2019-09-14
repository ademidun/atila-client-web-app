import {SET_LOGGED_IN_USER_PROFILE} from "../../actions";

const initialState = {
    loggedInUserProfile: null
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOGGED_IN_USER_PROFILE:
            return Object.assign({}, state, {
                loggedInUserProfile: action.payload
            });
        default:
            return state
    }
}
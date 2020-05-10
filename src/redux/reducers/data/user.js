import {
    SET_LOGGED_IN_USER_PROFILE,
    UPDATE_LOGGED_IN_USER_PROFILE,
    UPDATE_LOGGED_IN_EBOOK_USER_PROFILE
} from "../../actions/user";

const initialState = {
    loggedInUserProfile: null,
    ebookUserProfile: null,
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOGGED_IN_USER_PROFILE:
        case UPDATE_LOGGED_IN_USER_PROFILE:
            return Object.assign({}, state, {
                loggedInUserProfile: action.payload
            });
        case UPDATE_LOGGED_IN_EBOOK_USER_PROFILE:
            return Object.assign({}, state, {
                ebookUserProfile: action.payload
            });
        default:
            return state
    }
}
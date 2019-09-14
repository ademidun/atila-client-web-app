export const SET_LOGGED_IN_USER_PROFILE = "SET_LOGGED_IN_USER_PROFILE";

export function setLoggedInUserProfile(payload) {
    return {type: SET_LOGGED_IN_USER_PROFILE, payload}
}
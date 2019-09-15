export const SET_LOGGED_IN_USER_PROFILE = "SET_LOGGED_IN_USER_PROFILE";
export const SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET = "SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET";
export const INITIALIZE_LOGGED_IN_USER_PROFILE = "INITIALIZE_LOGGED_IN_USER_PROFILE";

export function setLoggedInUserProfile(payload) {
    return {type: SET_LOGGED_IN_USER_PROFILE, payload}
}
export function initializeLoggedInUserProfile() {
    return {type: INITIALIZE_LOGGED_IN_USER_PROFILE}
}
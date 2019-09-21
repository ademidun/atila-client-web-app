export const SET_LOGGED_IN_USER_PROFILE = "SET_LOGGED_IN_USER_PROFILE";
export const UPDATE_LOGGED_IN_USER_PROFILE = "UPDATE_LOGGED_IN_USER_PROFILE";
export const SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET = "SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET";
export const SET_IS_FINISHED_LOADING_LOGGED_IN_USER_PROFILE_GET = "SET_IS_FINISHED_LOADING_LOGGED_IN_USER_PROFILE_GET";
export const INITIALIZE_LOGGED_IN_USER_PROFILE = "INITIALIZE_LOGGED_IN_USER_PROFILE";

export function setLoggedInUserProfile(payload) {
    return {type: SET_LOGGED_IN_USER_PROFILE, payload}
}
export function setIsLoadingLoggedInUserProfile(payload) {
    return {type: SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET, payload}
}
export function initializeLoggedInUserProfile() {
    return {type: INITIALIZE_LOGGED_IN_USER_PROFILE}
}
export function updateLoggedInUserProfile(payload) {
    return {type: UPDATE_LOGGED_IN_USER_PROFILE, payload}
}
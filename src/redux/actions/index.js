// src/js/actions/index.js

export const SET_LOGGED_IN_USER_PROFILE = "SET_LOGGED_IN_USER_PROFILE";

export function addUserProfile(payload) {
    return { type: SET_LOGGED_IN_USER_PROFILE, payload }
}
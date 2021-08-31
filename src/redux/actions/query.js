export const UPDATE_CURRENT_USER_PROFILE_QUERY = "UPDATE_CURRENT_USER_PROFILE_QUERY";


export function updateCurrentUserProfileQuery(payload) {
    return {type: UPDATE_CURRENT_USER_PROFILE_QUERY, payload}
}
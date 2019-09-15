import { takeEvery, put } from "redux-saga/effects";
import {
    INITIALIZE_LOGGED_IN_USER_PROFILE,
    SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET,
    SET_LOGGED_IN_USER_PROFILE
} from "../actions/user";
import UserProfileAPI from "../../services/UserProfileAPI";

export default function* watcherSaga() {
    yield takeEvery(INITIALIZE_LOGGED_IN_USER_PROFILE, initializeLoggedInUserProfileSaga);
}
function* initializeLoggedInUserProfileSaga() {
    try {

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (UserProfileAPI.authenticateRequests(token, userId)) {
            yield put({ type: SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET, payload: false });
            const payload = yield UserProfileAPI.get(userId);
            yield put({ type: SET_LOGGED_IN_USER_PROFILE, payload: payload.data });
        }
    } catch (e) {
        yield put({ type: "API_ERRORED", payload: e });
    }

    yield put({ type: SET_IS_LOADING_LOGGED_IN_USER_PROFILE_GET, payload: false });

}

export const userSagas = [
    watcherSaga,
];
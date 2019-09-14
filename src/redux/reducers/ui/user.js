const initialState = {
    isLoggedIn: false
};

export default function uiReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_IS_LOGGED_IN':
            return Object.assign({}, state, {
                isLoggedIn: action.payload
            });
        default:
            return state
    }
}
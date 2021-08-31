import { combineReducers } from 'redux'
import queryReducer from './query'
import userReducer from './user'

export default combineReducers({
    user: userReducer,
    query: queryReducer,
})
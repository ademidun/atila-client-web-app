import { combineReducers } from 'redux'
import userReducer from './user'
import scholarshipReducer from "./scholarship";

export default combineReducers({
    user: userReducer,
    scholarship: scholarshipReducer,
})
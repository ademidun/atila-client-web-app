import { combineReducers } from 'redux'
import dataReducer from './data';
import uiReducer from './ui';

export default combineReducers({
    data: dataReducer,
    ui: uiReducer,
})
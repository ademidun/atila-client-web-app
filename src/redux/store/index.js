import {compose, createStore, applyMiddleware} from "redux";
import createSagaMiddleware from 'redux-saga';
import rootReducer from "../reducers/index";
import rootSaga from "../sagas";

const initialiseSagaMiddleware = createSagaMiddleware();
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    storeEnhancers(applyMiddleware(initialiseSagaMiddleware))
);
initialiseSagaMiddleware.run(rootSaga);

export default store;
import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import configureStore from "redux-mock-store";
import { initialReduxState, initialReduxStateLoggedIn } from '../models/Constants';
import { MemoryRouter } from 'react-router-dom';
import ReferredByInput from './ReferredByInput';
import {Provider} from "react-redux";

configure({ adapter: new Adapter() });
const mockStore = configureStore();
const store = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);

describe('<ReferredByInput />', () => {

    it('renders without crashing when no user is logged in', () => {

        const wrapper = shallow(

            <MemoryRouter>
                <Provider store={store}>
                    <ReferredByInput 
                        location={{ pathname: '/' }}/>
                </Provider>
            </MemoryRouter>
            );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders without crashing when logged in', () => {

        const wrapper = shallow(

            <MemoryRouter>
                <Provider store={store}>
                <ReferredByInput 
                    store={loggedInStore}
                    location={{ pathname: '/' }}/>
                    </Provider>
            </MemoryRouter>
            );
        expect(wrapper.html()).toBeTruthy();
    });

});
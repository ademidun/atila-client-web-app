import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import Register from './Register';
import configureStore from "redux-mock-store";
import { initialReduxState, initialReduxStateLoggedIn } from '../models/Constants';
import { MemoryRouter } from 'react-router-dom';

configure({ adapter: new Adapter() });
const mockStore = configureStore();
const store = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);

describe('<Register />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(

            <MemoryRouter>
            <Register 
                store={store}
                location={{ pathname: '/' }}/>

            </MemoryRouter>
            );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders without crashing when logged in', () => {

        const wrapper = shallow(

            <MemoryRouter>
            <Register 
                store={loggedInStore}
                location={{ pathname: '/' }}/>

            </MemoryRouter>
            );
        expect(wrapper.html()).toBeTruthy();
    });

});
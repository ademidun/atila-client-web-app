import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import "core-js/stable";
import Register, { LOG_OUT_BEFORE_REGISTERING_HELP_TEXT, PasswordShowHide } from './Register';
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
        expect(wrapper.html()).toContain("Register");
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
        expect(wrapper.html()).toContain(LOG_OUT_BEFORE_REGISTERING_HELP_TEXT);
    });

});


describe('<PasswordShowHide />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <PasswordShowHide />
            );
        expect(wrapper.html()).toBeTruthy();
    });

});
import React from 'react';
import {mount} from 'enzyme';
import { MemoryRouter } from 'react-router';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureStore();

import App from './App';
import configureStore from "redux-mock-store";
import {Provider} from "react-redux";
import {initialReduxState} from "./models/Constants";

const store = mockStore(initialReduxState);
describe('<App />', () => {
    test('renders without crashing', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/']}>
                <Provider store={store}>
                    <App/>
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    test('renders LandingPageOld', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/']}>
                <Provider store={store}>
                    <App/>
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toContain('Navbar');
        expect(wrapper.find('.Navbar').at(0).html()).toContain('<nav');
    });
});
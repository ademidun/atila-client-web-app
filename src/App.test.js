import React from 'react';
import {mount, shallow} from 'enzyme';
import { MemoryRouter } from 'react-router';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureStore();

import App from './App';
import LandingPage from "./scenes/LandingPage/LandingPage";
import configureStore from "redux-mock-store";
import {initialReduxState} from "./services/utils";
import ScholarshipsList from "./scenes/Scholarship/ScholarshipsList";
import {scholarshipsListMockData} from "./models/Scholarship";
import {Provider} from "react-redux";
import Footer from "./components/Footer/Footer";

const store = mockStore(initialReduxState);

it('renders without crashing', () => {
    const wrapper = mount(
        <MemoryRouter initialEntries={[ '/' ]}>
            <Provider store={store}>
                <App />
            </Provider>
        </MemoryRouter>
    );
    expect(wrapper.html()).toBeTruthy();
});

it('renders LandingPage', () => {
    const wrapper = mount(
        <MemoryRouter initialEntries={[ '/' ]}>
            <Provider store={store}>
                <App />
            </Provider>
        </MemoryRouter>
    );
    expect(wrapper.html()).toContain('Navbar');
    expect(wrapper.find('.Navbar').at(0).html()).toContain('<nav');
});

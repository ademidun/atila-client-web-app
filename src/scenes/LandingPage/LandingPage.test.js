import React from 'react';
import { configure, mount } from 'enzyme';
import configureStore from "redux-mock-store";
import Banner from './Banner';
import LandingPage from './LandingPage';
import {initialReduxState, initialReduxStateLoggedIn} from "../../models/Constants";
import Adapter from 'enzyme-adapter-react-16';
import {MemoryRouter} from "react-router-dom";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {scholarshipsListMockData} from "../../models/Scholarship";

configure({ adapter: new Adapter() });
const mockStore = configureStore();

const store = mockStore(initialReduxState);

jest.mock('../../services/ScholarshipsAPI');
ScholarshipsAPI.getDueSoon.mockImplementation(() => {
    return Promise.resolve({ data: { results: scholarshipsListMockData } } );
});
jest.mock('rc-scroll-anim/lib/ScrollParallax', () => () => 'ScrollParallaxMock');


describe('<LandingPage />', () => {
    it('renders without crashing', () => {
        const wrapper = mount(
            <MemoryRouter>
                <LandingPage store={store} />
            </MemoryRouter>
        );
        expect(wrapper).toBeTruthy();
    });

    it('renders welcome message', () => {
        const wrapper = mount(
            <MemoryRouter>
            <LandingPage store={store} />
            </MemoryRouter>
            );
        expect(wrapper.find(Banner).length).toBe(1);
    });
});
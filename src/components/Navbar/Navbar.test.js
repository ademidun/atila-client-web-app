import React from 'react';
import {MemoryRouter} from "react-router-dom";
import {shallow, configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
configure({ adapter: new Adapter() });
const mockStore = configureStore();

import Navbar from './Navbar';
import {UserProfileTest1} from "../../models/UserProfile";
import {initialReduxState} from "../../services/utils";

describe('<Navbar />', () => {
    it('renders without crashing', () => {
        shallow(<Navbar />);
    });

    it('renders searchLink', () => {
        const store = mockStore(initialReduxState);
        const wrapper = mount(
            <MemoryRouter>
                <Navbar store={store} />
            </MemoryRouter>
        );
        const searchLink = 'href="/search"';
        expect(wrapper.find(Navbar).html()).toContain(searchLink);
    });

    it('renders userprofile nav item', () => {
        initialReduxState.data.user.loggedInUserProfile = UserProfileTest1;
        const store = mockStore(initialReduxState);
        const wrapper = mount(
            <MemoryRouter>
                <Navbar store={store} />
            </MemoryRouter>
        );
        wrapper.update();
        const userProfileLink = '<a class="dropdown-item" href="/profile/cbarkley">View Profile</a>';
        expect(wrapper.find(Navbar).html()).toContain(userProfileLink);
    });
});
import React from 'react';
import {MemoryRouter} from "react-router-dom";
import {shallow, configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
configure({ adapter: new Adapter() });
const mockStore = configureStore();

import Navbar from './Navbar';
import {UserProfileTest1} from "../../models/UserProfile";
import {initialReduxState, relatedItems} from "../../models/Constants";
import ContentList from "../ContentList";
import {EssayIveyApplication} from "../../models/Essay";

describe('<Navbar />', () => {
    it('renders without crashing', () => {
        shallow(<Navbar />);
    });
    /* TODO: uncomment this test if we add search back due to popularity

        it('renders searchLink', () => {
            const store = mockStore(initialReduxState);
            const wrapper = mount(
                <MemoryRouter>
                    <Navbar store={store} />
                </MemoryRouter>
            );
            const searchLink = 'href="/search"';
            expect(wrapper.find(Navbar).html()).toContain(searchLink);
        });*/

    it('renders rankings', () => {
        const store = mockStore(initialReduxState);
        const wrapper = mount(
            <MemoryRouter>
                <Navbar store={store} />
            </MemoryRouter>
        );
        const rankingsLink = 'href="/rankings"';
        expect(wrapper.find(Navbar).html()).toContain(rankingsLink);
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
        expect(wrapper.find('.anticon-user').length).toBe(1);
    });

    it('does not render userprofile nav item if not logged in', () => {
        initialReduxState.data.user.loggedInUserProfile = null;
        const store = mockStore(initialReduxState);
        const wrapper = mount(
            <MemoryRouter>
                <Navbar store={store} />
            </MemoryRouter>
        );
        wrapper.update();
        expect(wrapper.find('.anticon-user').length).toBe(0);
    });
});
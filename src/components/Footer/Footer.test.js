import React from 'react';
import {Link, MemoryRouter} from "react-router-dom";
import {shallow, configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from "redux-mock-store";
import Footer from './Footer';
import {initialReduxState} from "../../models/Constants";

configure({ adapter: new Adapter() });

const mockStore = configureStore();

describe('<Footer />', () => {
    it('renders without crashing', () => {
        shallow(<Footer />);
    });

    it('renders blogLink', () => {
        const store = mockStore(initialReduxState);
        const wrapper = mount(
            <MemoryRouter>
                <Footer store={store} />
            </MemoryRouter>
        );
        const blogLink = (
            <Link to="/blog">
                Blogs
            </Link>);
        expect(wrapper.contains(blogLink)).toEqual(true);
    });
});
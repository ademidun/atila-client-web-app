import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable"; // needed otherwise .finally in promise does not work

configure({ adapter: new Adapter() });

import BlogsList from './BlogsList';
import ContentList from "../../components/ContentList";


describe('<BlogsList />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(<BlogsList />);
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders ContentList', () => {

        const wrapper = shallow(
                <BlogsList />
        );

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.find(ContentList)).toBeTruthy();

    });

});
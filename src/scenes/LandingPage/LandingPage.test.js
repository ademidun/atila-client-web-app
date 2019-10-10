import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Banner from './Banner';

configure({ adapter: new Adapter() });

import LandingPage from './LandingPage';

describe('<LandingPageOld />', () => {
    it('renders without crashing', () => {
        shallow(<LandingPage />);
    });

    it('renders welcome message', () => {
        const wrapper = shallow(<LandingPage />);
        expect(wrapper.find(Banner).length).toBe(1);
    });
});
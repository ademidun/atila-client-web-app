import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import LandingPage from '../LandingPageOld/LandingPage';

describe('<LandingPageOld />', () => {
    it('renders without crashing', () => {
        shallow(<LandingPage />);
    });

    it('renders welcome message', () => {
        const wrapper = shallow(<LandingPage />);
        const welcome = <h1 className="form-header sans-serif-font" style={{marginBottom: 0}}>Easily Find and Apply to Scholarships</h1>;
        // expect(wrapper.contains(welcome)).toBe(true);
        expect(wrapper.contains(welcome)).toEqual(true);
    });
});
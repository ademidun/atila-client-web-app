import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable"; // needed otherwise .finally in promise does not work

configure({ adapter: new Adapter() });

import ScholarshipsList from './ScholarshipsList';
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {
    ScholarshipEngineering,
    scholarshipsListMockData,
    scholarshipsListResponseMockData
} from "../../models/Scholarship";
import {MemoryRouter} from "react-router-dom";
jest.mock('../../services/ScholarshipsAPI');

ScholarshipsAPI.searchScholarships.mockImplementation(() => Promise.resolve(scholarshipsListResponseMockData));

describe('<ScholarshipsList />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(<ScholarshipsList location={{ search: '?q=engineering' }} />);
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders scholarshipsFound title', async (done) => {

        const wrapper = mount(
            <MemoryRouter>
                <ScholarshipsList location={{ search: '?q=engineering' }} />
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ScholarshipsList);
        const scholarshipsFound = '3 Scholarships for Engineering found';
        childWrapper.instance().setState({ scholarships: scholarshipsListMockData, totalScholarshipsCount: 3 });
        childWrapper.update();

        expect(wrapper.find(ScholarshipsList).html()).toContain(scholarshipsFound);
        expect(wrapper.find(ScholarshipsList).html()).toContain(ScholarshipEngineering.name);

        done();
    });

});
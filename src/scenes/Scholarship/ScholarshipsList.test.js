import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable"; // needed otherwise .finally in promise does not work


import ScholarshipsList from './ScholarshipsList';
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {
    ScholarshipEngineering,
    scholarshipsListMockData,
    scholarshipsListResponseMockData
} from "../../models/Scholarship";
import {MemoryRouter} from "react-router-dom";
import configureStore from "redux-mock-store";
import {initialReduxState} from "../../services/utils";
jest.mock('../../services/ScholarshipsAPI');

ScholarshipsAPI.searchScholarships.mockImplementation(() => Promise.resolve(scholarshipsListResponseMockData));

configure({ adapter: new Adapter() });
const mockStore = configureStore(initialReduxState);
let store;
describe('<ScholarshipsList />', () => {

    beforeEach(() => {
        store = mockStore(initialReduxState);
    });

    it('renders without crashing', () => {

        const wrapper = mount(
            <MemoryRouter>
            <ScholarshipsList
                location={{ search: '?q=engineering' }}
                store={store}
            />
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    xit('renders scholarshipsFound title', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <ScholarshipsList
                    location={{ search: '?q=engineering' }}
                    store={store}/>
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ScholarshipsList).dive();
        const scholarshipsFound = '3 Scholarships for Engineering found';
        childWrapper.instance().setState({ scholarships: scholarshipsListMockData, totalScholarshipsCount: 3 });
        childWrapper.update();

        expect(wrapper.find(ScholarshipsList).html()).toContain(scholarshipsFound);
        expect(wrapper.find(ScholarshipsList).html()).toContain(ScholarshipEngineering.name);

    });

});
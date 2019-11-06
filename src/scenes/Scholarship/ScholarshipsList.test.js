import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable"; // needed otherwise .finally in promise does not work


import ScholarshipsList from './ScholarshipsList';
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {
    scholarshipsListResponseMockData
} from "../../models/Scholarship";
import {MemoryRouter} from "react-router-dom";
import configureStore from "redux-mock-store";
import {initialReduxState} from "../../models/Constants";
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

        const wrapper = shallow(
            <MemoryRouter>
            <ScholarshipsList
                match={{ params: { searchString: 'engineering' } } }
                store={store}
            />
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

});
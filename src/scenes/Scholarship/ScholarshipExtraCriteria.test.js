import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import "core-js/stable";
import {
    doesScholarshipHaveExtraCriteria,
    ScholarshipExtraCriteriaTest as ScholarshipExtraCriteria
} from "./ScholarshipExtraCriteria";
import configureStore from "redux-mock-store";
import {UserProfileTest1} from "../../models/UserProfile";
import {initialReduxState} from "../../models/Constants";
import {Provider} from "react-redux";
import {ScholarshipEngineering, ScholarshipGeneral, ScholarshipMilton} from "../../models/Scholarship";
import {MemoryRouter} from "react-router-dom";

configure({ adapter: new Adapter() });
const mockStore = configureStore();
const store = mockStore(initialReduxState);
const ScholarshipEngineeringFemaleOnly = {
    ...ScholarshipGeneral,
    female_only: true,
};

describe('<ScholarshipExtraCriteria />', () => {

    it('should return correct boolean value for doesScholarshipHaveExtraCriteria() ', () => {
        let isExtraCriteria = doesScholarshipHaveExtraCriteria(ScholarshipGeneral);
        expect(isExtraCriteria).toBe(false);

        isExtraCriteria = doesScholarshipHaveExtraCriteria(ScholarshipEngineeringFemaleOnly);
        expect(isExtraCriteria).toBe(true);

        isExtraCriteria = doesScholarshipHaveExtraCriteria(ScholarshipMilton);
        expect(isExtraCriteria).toBe(true);

    });

    it('renders without crashing (Not Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipExtraCriteria scholarship={ScholarshipEngineering}
                    />
                </Provider>
            </MemoryRouter>
            );
            expect(wrapper.html()).toBeTruthy();
    });

    it('renders without crashing (Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipExtraCriteria
                        scholarship={ScholarshipEngineering}
                        loggedInUserProfile={UserProfileTest1}
                    />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders no extraCriteria', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipExtraCriteria
                        scholarship={ScholarshipGeneral}
                        loggedInUserProfile={UserProfileTest1}
                    />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeFalsy();

    });

    it('renders extraCriteria Female Only', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipExtraCriteria
                        scholarship={ScholarshipEngineeringFemaleOnly}
                        loggedInUserProfile={UserProfileTest1}
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.html()).toContain('Female Only');
        expect(wrapper.html()).toContain('Not a Female?');
    });

    it('renders extraCriteria Location, not logged in', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipExtraCriteria
                        scholarship={ScholarshipMilton}
                    />
                </Provider>
            </MemoryRouter>
            );
        expect(wrapper.html()).toContain(ScholarshipMilton.city[0].name);

    });

    it('renders extraCriteria Major and asks user to fix info', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipExtraCriteria
                        scholarship={ScholarshipEngineering}
                        loggedInUserProfile={UserProfileTest1}
                    />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toContain(ScholarshipEngineering.eligible_programs[0]);
        expect(wrapper.html()).toContain(`/profile/${UserProfileTest1.username}/edit`);

    });

    it('renders extraCriteria Major and not ask user to fix info in view as mode', () => {

        const viewAsUserProfileEngineering = {
            ...UserProfileTest1,
            eligible_programs: ['Business'],
            major: 'Software Engineering',
            username: 'mrfixit'
        };
        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipExtraCriteria
                        scholarship={ScholarshipEngineering}
                        loggedInUserProfile={UserProfileTest1}
                        viewAsUserProfile={viewAsUserProfileEngineering}
                    />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toContain(viewAsUserProfileEngineering.eligible_programs[0]);
        expect(wrapper.html()).toContain(viewAsUserProfileEngineering.major);
        expect(wrapper.html()).not.toContain(`/profile/${UserProfileTest1.username}/edit`);
        expect(wrapper.html()).not.toContain(`/profile/${viewAsUserProfileEngineering.username}/edit`);

    });

});
import React from "react";
import { configure, shallow } from "enzyme";
import ApplicationViewPreviousApplications from "./ApplicationViewPreviousApplications";
import Adapter from "enzyme-adapter-react-16";
import { UserProfileTest1 } from "../../models/UserProfile";

configure({ adapter: new Adapter() });

describe('<ApplicationViewPreviousApplications />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <ApplicationViewPreviousApplications
                userProfile={UserProfileTest1}/>
        );
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain("View Previous Applications");
    });

    it('renders with no previous applications', () => {

        const wrapper = shallow(
            <ApplicationViewPreviousApplications
                userProfile={UserProfileTest1}
                applications={[]}
            />
        );
        expect(wrapper.html()).toBeTruthy();
    });

});
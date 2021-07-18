import React from "react";
import { configure, shallow } from "enzyme";
import EmailModal from "./EmailModal";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe('<EmailModal />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <EmailModal
                showModalText={"Message Applicant..."}
            />
        );
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain("Message Applicant...");
    });

});
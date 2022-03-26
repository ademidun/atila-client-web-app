import React from "react";
import { configure, shallow } from "enzyme";
import EmailModal from "./EmailModal";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

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
import React from "react";
import { configure, shallow } from "enzyme";
import ButtonModal from "./ButtonModal";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

configure({ adapter: new Adapter() });

describe('<ButtonModal />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <ButtonModal
                showModalText={"Test Show Modal"}
            />
        );
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain("Test Show Modal");
    });

});
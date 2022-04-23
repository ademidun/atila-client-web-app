import React from "react";
import { configure, shallow } from "enzyme";
import ReportIncorrectInfo from "./ReportIncorrectInfo";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { DEFAULT_SCHOLARSHIP } from "../models/Scholarship";

configure({ adapter: new Adapter() });

describe('<ReportIncorrectInfo />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <ReportIncorrectInfo scholarship={DEFAULT_SCHOLARSHIP} />
        );
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain("Report Incorrect Information");
    });

});
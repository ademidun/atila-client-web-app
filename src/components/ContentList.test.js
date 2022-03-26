import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import "core-js/stable";
import ContentList from "./ContentList";
import {BlogWhatIsAtila} from "../models/Blog";
import EssaysApi from "../services/EssaysAPI";
import {EssayIveyApplication} from "../models/Essay";
import {MemoryRouter} from "react-router-dom";

configure({ adapter: new Adapter() });

describe('<ContentList />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <ContentList ContentAPI={EssaysApi} contentType={'essay'} />
            </MemoryRouter>
            );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders Essays Content List', () => {

        const wrapper = mount(
            <MemoryRouter>
                <ContentList ContentAPI={EssaysApi} contentType={'essay'} />
            </MemoryRouter>
            );
        let childWrapper = wrapper.find(ContentList);
        childWrapper.instance().setState({ contentItems: [EssayIveyApplication] });
        wrapper.update();

        expect(wrapper.find(ContentList).html()).toContain(EssayIveyApplication.title);
        expect(wrapper.find(ContentList).html()).not.toContain(BlogWhatIsAtila.title);

    });

});
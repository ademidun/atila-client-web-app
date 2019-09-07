import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import ContentList from "./ContentList";
import {BlogWhatIsAtila} from "../models/Blog";
import RelatedItems from "./RelatedItems";
import EssaysApi from "../services/EssaysAPI";
import {EssayIveyApplication} from "../models/Essay";
import {MemoryRouter} from "react-router-dom";

configure({ adapter: new Adapter() });

jest.mock('../services/EssaysAPI');

EssaysApi.list.mockImplementation(() => Promise.resolve({ data: { results: [EssayIveyApplication] } } ));

describe('<ContentList />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(<ContentList ContentAPI={EssaysApi} contentType={'essay'} />);
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
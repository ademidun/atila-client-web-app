import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import ContentDetail from "./ContentDetail";
import {BlogWhatIsAtila} from "../../models/Blog";
import BlogsApi from "../../services/BlogsAPI";
import RelatedItems from "../RelatedItems";
import {MemoryRouter} from "react-router-dom";
import SearchApi from "../../services/SearchAPI";
import {relatedItems} from "../RelatedItems.test";

configure({ adapter: new Adapter() });

jest.mock('../../services/SearchAPI');
SearchApi.relatedItems.mockImplementation(() => Promise.resolve({ data: { items: relatedItems } } ));

describe('<ContentDetail />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(<ContentDetail contentType={'blog'}
                                               contentSlug={'atila/what-is-atila'}
                                               ContentAPI={BlogsApi}
        />);
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders What is Atila Blog', () => {

        const wrapper = mount(
            <MemoryRouter>
                <ContentDetail contentType={'blog'}
                               contentSlug={'atila/what-is-atila'}
                               ContentAPI={BlogsApi}
                />
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ContentDetail);
        childWrapper.instance().setState({ content: BlogWhatIsAtila });
        wrapper.update();

        expect(wrapper.find(ContentDetail).html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find(ContentDetail).find('img.header-image').prop('src')).toEqual(BlogWhatIsAtila.header_image_url);

    });

    it('renders Related Items', () => {

        const wrapper = mount(
            <MemoryRouter>
                <ContentDetail contentType={'blog'}
                               contentSlug={'atila/what-is-atila'}
                               ContentAPI={BlogsApi}
                />
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ContentDetail);
        childWrapper.instance().setState({ content: BlogWhatIsAtila });
        wrapper.update();

        expect(wrapper.find(ContentDetail).find(RelatedItems).length).toBe(1);

    });

});
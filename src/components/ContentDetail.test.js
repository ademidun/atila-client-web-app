import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import ContentDetail from "./ContentDetail";
import {BlogWhatIsAtila} from "../models/Blog";
import BlogsApi from "../services/BlogsAPI";
import RelatedItems from "./RelatedItems";
import ContentList from "./ContentList";

configure({ adapter: new Adapter() });



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
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
            />
        );
        wrapper.setState({ content: BlogWhatIsAtila });
        wrapper.update();

        expect(wrapper.html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find('img.header-image').prop('src')).toEqual(BlogWhatIsAtila.header_image_url);

    });

    it('renders Related Items', () => {

        const wrapper = shallow(
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
            />
        );
        wrapper.setState({ content: BlogWhatIsAtila });
        wrapper.update();

        console.log(wrapper.find(RelatedItems));
        expect(wrapper.find(RelatedItems).length).toBe(1);

    });

});
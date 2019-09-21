import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import {ContentDetailTest as ContentDetail} from "./ContentDetail";
import {BlogWhatIsAtila} from "../../models/Blog";
import BlogsApi from "../../services/BlogsAPI";
import RelatedItems from "../RelatedItems";
import {MemoryRouter} from "react-router-dom";
import SearchApi from "../../services/SearchAPI";
import {relatedItems} from "../RelatedItems.test";
import configureStore from "redux-mock-store";
import {Provider} from "react-redux";
import {UserProfileTest1} from "../../models/UserProfile";
import ContentList from "../ContentList";
import {EssayIveyApplication} from "../../models/Essay";
import {initialReduxState} from "../../models/Constants";

configure({ adapter: new Adapter() });
const mockStore = configureStore();
const store = mockStore(initialReduxState);

jest.mock('../../services/SearchAPI');
SearchApi.relatedItems.mockImplementation(() => Promise.resolve({ data: { items: relatedItems } } ));

describe('<ContentDetail />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <MemoryRouter>
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
                           userProfile={UserProfileTest1}
            />
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders What is Atila Blog', () => {

        const wrapper = mount(
            <MemoryRouter>
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
                           userProfile={UserProfileTest1}
            />
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ContentDetail);
        childWrapper.setState({ content: BlogWhatIsAtila });
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
                           userProfile={UserProfileTest1}
            />
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ContentDetail);
        childWrapper.setState({ content: BlogWhatIsAtila });
        wrapper.update();

        expect(wrapper.find(ContentDetail).find(RelatedItems).length).toBe(1);
        expect(wrapper.find(ContentDetail).html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find(ContentDetail).html()).not.toContain(EssayIveyApplication.title);

    });

});
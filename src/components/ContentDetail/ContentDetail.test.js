import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from "redux-mock-store";
import {Provider} from "react-redux";
import "core-js/stable";
import {ContentDetailTest as ContentDetail} from "./ContentDetail";
import {BlogWhatIsAtila} from "../../models/Blog";
import BlogsApi from "../../services/BlogsAPI";
import RelatedItems from "../RelatedItems";
import {MemoryRouter} from "react-router-dom";
import SearchApi from "../../services/SearchAPI";
import {UserProfileTest1} from "../../models/UserProfile";
import {EssayIveyApplication} from "../../models/Essay";
import {initialReduxState, initialReduxStateLoggedIn, relatedItems} from "../../models/Constants";

configure({ adapter: new Adapter() });

const mockStore = configureStore();

const guestUserStore = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);

jest.mock("../../services/utils", () => {
    return {
        ...(jest.requireActual("../../services/utils")),
        makeXHRRequestAsPromise: () => Promise.reject({
            status: 400,
            statusText: '',
            response: {error: 'Mocking XHR'},
        }),
        getGuestUserId: () => 'randomGuestUserId123',
    }
});
jest.mock('../../services/SearchAPI');
jest.mock("react-markdown", () => (props) => {
    return <>{props.children}</>
})

SearchApi.relatedItems.mockImplementation(() => Promise.resolve({ data: { items: relatedItems } } ));

describe('<ContentDetail />', () => {

    it('renders without crashing (Not Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                <ContentDetail contentType={'blog'}
                               contentSlug={'atila/what-is-atila'}
                               ContentAPI={BlogsApi}
                />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders without crashing (Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={loggedInStore}>
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
                           userProfile={UserProfileTest1}
            />
            </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders What is Atila Blog (Logged In)', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={loggedInStore}>
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
                           userProfile={UserProfileTest1}
            />
            </Provider>
            </MemoryRouter>
        );
        wrapper.find(ContentDetail).setState({ content: BlogWhatIsAtila });
        wrapper.update();
        let childWrapper = wrapper.find(ContentDetail);

        const contentTitle = `<h1>${BlogWhatIsAtila.title}</h1>`;
        expect(childWrapper.html()).toContain(contentTitle);
        expect(childWrapper
            .find('img.header-image').prop('src')).toEqual(BlogWhatIsAtila.header_image_url);
        expect(childWrapper
            .find('div.ContentBody').prop('dangerouslySetInnerHTML')).toBeTruthy();

    });

    it('renders Related Items (Logged In)', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={loggedInStore}>
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
                           userProfile={UserProfileTest1}
            />
            </Provider>
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ContentDetail);
        childWrapper.setState({ content: BlogWhatIsAtila });
        wrapper.update();

        expect(wrapper.find(ContentDetail).find(RelatedItems).length).toBe(1);
        expect(wrapper.find(ContentDetail).html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find(ContentDetail).html()).not.toContain(EssayIveyApplication.title);

    });

    it('renders Related Items (NOT Logged In)', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={guestUserStore}>
            <ContentDetail contentType={'blog'}
                           contentSlug={'atila/what-is-atila'}
                           ContentAPI={BlogsApi}
            />
            </Provider>
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(ContentDetail);
        childWrapper.setState({ content: BlogWhatIsAtila });
        wrapper.update();
        expect(wrapper.find(ContentDetail).html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find(ContentDetail).html()).not.toContain(EssayIveyApplication.title);

    });

    it('renders Content Detail if Not Logged In', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                <ContentDetail contentType={'blog'}
                               contentSlug={'atila/what-is-atila'}
                               ContentAPI={BlogsApi}
                />
                </Provider>
            </MemoryRouter>
        );
        wrapper.find(ContentDetail).setState({ content: BlogWhatIsAtila });
        wrapper.update();
        let childWrapper = wrapper.find(ContentDetail);

        expect(childWrapper
            .find('div.ContentBody').exists()).toBeTruthy();

        expect(childWrapper
            .find('div.ContentBody').prop('dangerouslySetInnerHTML').__html).toBeTruthy();

    });

    it('renders Partial Essay if Not Logged In', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                <ContentDetail contentType={'essay'}
                               contentSlug={'atila/what-is-atila'}
                               ContentAPI={BlogsApi}
                />
                </Provider>
            </MemoryRouter>
        );
        wrapper.find(ContentDetail).setState({ content: BlogWhatIsAtila });
        wrapper.update();
        let childWrapper = wrapper.find('.ContentBody');

        expect(childWrapper
            .find('div.paywall-border').exists()).toBeTruthy();
        const registerPrompt = "<p>Register to Read Full Essay</p>";

        expect(childWrapper.html()).toContain(registerPrompt);

    });

});
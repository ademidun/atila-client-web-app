import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import RelatedItems from "./RelatedItems";
import {ScholarshipEngineering} from "../models/Scholarship";
import {BlogWhatIsAtila} from "../models/Blog";
import {MemoryRouter} from "react-router-dom";
import {EssayIveyApplication} from "../models/Essay";
import {relatedItems} from "../models/Constants";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { initialReduxState } from "../models/Constants";

configure({ adapter: new Adapter() });

const mockStore = configureStore();
const guestUserStore = mockStore(initialReduxState);

const mockUseRelatedProductsResults = {
    recommendations: [{
        id: 0,
        title: relatedItems[0].title,
        slug: relatedItems[0].slug,
        description: relatedItems[0].description,
    }, {
        id: 1,
        title: relatedItems[1].title,
        slug: relatedItems[1].slug,
        description: relatedItems[1].description,
    }, {
        id: 2,
        title: relatedItems[2].title,
        slug: relatedItems[2].slug,
        description: relatedItems[2].description,
    }],
    status: 'idle'
}

jest.mock('@algolia/recommend-react', () => ({
    useRelatedProducts: () => { return mockUseRelatedProductsResults; }
}));


describe('<RelatedItems />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                    <RelatedItems id={1} itemType={'blog'}/>
                </Provider>
            </MemoryRouter>);
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders 3 related Items', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                    <RelatedItems id={1} itemType={'blog'} />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find(RelatedItems).html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find(RelatedItems).html()).toContain(ScholarshipEngineering.description);
        expect(wrapper.find(RelatedItems).html()).toContain(EssayIveyApplication.slug);
    });

});
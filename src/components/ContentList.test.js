import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import "core-js/stable";
import ContentList from "./ContentList";
import {BlogWhatIsAtila} from "../models/Blog";
import EssaysApi from "../services/EssaysAPI";
import {EssayIveyApplication} from "../models/Essay";
import {MemoryRouter} from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { initialReduxState } from "../models/Constants";


configure({ adapter: new Adapter() });


const mockStore = configureStore();
const guestUserStore = mockStore(initialReduxState);

jest.mock('../services/EssaysAPI');

EssaysApi.list.mockImplementation(() => Promise.resolve({ data: { results: [EssayIveyApplication] } } ));

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
                <Provider store={guestUserStore}>
                    <ContentList ContentAPI={EssaysApi} contentType={'essay'} />
                </Provider>
            </MemoryRouter>
            );
        let childWrapper = wrapper.find(ContentList);
        childWrapper.instance().setState({ contentItems: [EssayIveyApplication] });
        wrapper.update();

        expect(wrapper.find(ContentList).html()).toContain(EssayIveyApplication.title);
        expect(wrapper.find(ContentList).html()).not.toContain(BlogWhatIsAtila.title);

    });

});
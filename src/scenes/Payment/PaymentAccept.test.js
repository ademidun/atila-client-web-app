import {configure, shallow} from "enzyme";
import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {MemoryRouter} from "react-router-dom";
import PaymentAccept from "./PaymentAccept";
import configureStore from "redux-mock-store";
import { initialReduxState, initialReduxStateLoggedIn } from "../../models/Constants";
import {Provider} from "react-redux";
import { NOT_LOGGED_IN_PAYMENT_ACCEPT_ERROR, UNAUTHORIZED_TO_VIEW_PAGE } from "../../models/ConstantsErrors";


configure({ adapter: new Adapter() })
const mockStore = configureStore();

const guestUserStore = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);

describe('<PaymentAccept />', () => {
    it('renders without crashing - guest user', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                    <PaymentAccept />
                </Provider>
            </MemoryRouter>
            );

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain(NOT_LOGGED_IN_PAYMENT_ACCEPT_ERROR);

    });
    it('renders without crashing - logged in user - no application permission', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={loggedInStore}>
                    <PaymentAccept />
                </Provider>
            </MemoryRouter>
            );

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain(UNAUTHORIZED_TO_VIEW_PAGE);

    });
});
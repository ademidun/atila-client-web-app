import {configure, mount, shallow} from "enzyme";
import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {MemoryRouter} from "react-router-dom";
import PaymentAccept from "./PaymentAccept";
import configureStore from "redux-mock-store";
import { initialReduxState, initialReduxStateLoggedIn } from "../../models/Constants";
import {Provider} from "react-redux";
import { NOT_LOGGED_IN_PAYMENT_ACCEPT_ERROR, UNAUTHORIZED_TO_VIEW_PAGE } from "../../models/ConstantsErrors";

import ApplicationFinalistSTEM from '../../services/mocks/Application/ApplicationFinalistSTEM.json';
import { MockAPI } from "../../services/mocks/MockAPI";

const runAllPromises = () => new Promise(setImmediate);

const paymentAcceptanceStepsTitles = [
    {title: 'Verify Email'},
    {title: 'Security Question'},
    {title: 'Thank You Email'},
    {title: 'Accept Payment'},
]

configure({ adapter: new Adapter() })
const mockStore = configureStore();

const guestUserStore = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);

        
let mockApi = new MockAPI();
mockApi.initializeMocks();

describe('<PaymentAccept />', () => {
    it('renders without crashing - guest user', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                    <PaymentAccept
                        location={{ search: `?application=${ApplicationFinalistSTEM.id}` }} />
                </Provider>
            </MemoryRouter>
            );

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain(NOT_LOGGED_IN_PAYMENT_ACCEPT_ERROR);

    });
    it('renders not authorized notification for logged in user, not application owner', async () => {
        mockApi.mockApplicationGet({}, 403);

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={loggedInStore}>
                    <PaymentAccept
                        location={{ search: `?application=${ApplicationFinalistSTEM.id}` }} />
                </Provider>
            </MemoryRouter>
            );
        await runAllPromises();

        expect(wrapper.html()).toContain(UNAUTHORIZED_TO_VIEW_PAGE);
        paymentAcceptanceStepsTitles.forEach(step => {
            expect(wrapper.html()).not.toContain(step.title);    
        })

    });

    it('renders application steps for logged in user and is application owner', async () => {

        ApplicationFinalistSTEM.user.user = initialReduxStateLoggedIn.data.user.loggedInUserProfile.user;
        ApplicationFinalistSTEM.is_winner = true;
        mockApi.mockApplicationGet(ApplicationFinalistSTEM);


        const wrapper = mount(
            <MemoryRouter>
                <Provider store={loggedInStore}>
                    <PaymentAccept
                        location={{ search: `?application=${ApplicationFinalistSTEM.id}` }} />
                </Provider>
            </MemoryRouter>
            );
        await runAllPromises();

        expect(wrapper.html()).not.toContain(UNAUTHORIZED_TO_VIEW_PAGE);
        paymentAcceptanceStepsTitles.forEach(step => {
            expect(wrapper.html()).toContain(step.title);    
        })
        

    });

});
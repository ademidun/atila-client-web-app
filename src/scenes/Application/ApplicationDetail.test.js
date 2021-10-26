import React from "react";
import { configure, mount } from "enzyme";
import {MemoryRouter} from "react-router-dom";
import configureStore from "redux-mock-store";
import {Provider} from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import ApplicationDetail from "./ApplicationDetail";
import {initialReduxState, initialReduxStateLoggedIn} from "../../models/Constants";
import { MockAPI } from "../../services/mocks/MockAPI";
import ApplicationFinalistSTEM from '../../services/mocks/Application/ApplicationFinalistSTEM.json';

const runAllPromises = () => new Promise(setImmediate);

configure({ adapter: new Adapter() });
const mockStore = configureStore();

const guestUserStore = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);

let mockApi = new MockAPI();
mockApi.initializeMocks();
describe('<ApplicationDetail />', () => {

    it.skip('renders without crashing - Logged In', async () => {

        const wrapper = mount(
            <MemoryRouter>
            <Provider store={loggedInStore}>
            <ApplicationDetail
                match={{ params: { applicationID: ApplicationFinalistSTEM.id } }}
                location={{ pathname: `/application/${ApplicationFinalistSTEM.id}` }}
            />
            </Provider>
            </MemoryRouter>
        );
        await runAllPromises();

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html()).toContain(ApplicationFinalistSTEM.scholarship.name);
    });
    it('renders no application - guest user', async () => {
        mockApi.mockApplicationGet({}, 403);
        const wrapper = mount(
            <MemoryRouter>
            <Provider store={guestUserStore}>
            <ApplicationDetail
                match={{ params: { applicationID: ApplicationFinalistSTEM.id } }}
                location={{ pathname: `/application/${ApplicationFinalistSTEM.id}` }}
            />
            </Provider>
            </MemoryRouter>
        );
        await runAllPromises();

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.html().toLowerCase()).toContain("application not found");
    });

});
import React from "react";
import { createRoot } from 'react-dom/client';
import { configure } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import configureStore from "redux-mock-store";
import { initialReduxState, initialReduxStateLoggedIn } from "../../../models/Constants";
import { DEFAULT_CRYPTO_SCHOLARSHIP } from "../../../models/Scholarship.class";
import { MockAPI } from "../../../services/mocks/MockAPI";
import ScholarshipApplyButton from "./ScholarshipApplyButton";
import { act } from 'react-dom/test-utils';

const runAllPromises = () => new Promise(setImmediate);

configure({ adapter: new Adapter() });
const mockStore = configureStore();

const guestUserStore = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);


let mockApi = new MockAPI();
let container: HTMLElement;

mockApi.initializeMocks();
describe('<ScholarshipApplyButton />', () => {
    let root: any;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });
      
    afterEach(() => {
        root.unmount();
        document.body.removeChild(container);
    });

    it('renders without crashing - Logged In and apply now works', async () => {
        act(() => {
            root.render(
                <MemoryRouter>
                    <Provider store={loggedInStore}>
                        <ScholarshipApplyButton scholarship={DEFAULT_CRYPTO_SCHOLARSHIP} />
                    </Provider>
                </MemoryRouter>
            );
        });
        await runAllPromises();

        const button = container.querySelector('button.ScholarshipApplyButton');
        expect(button).toBeTruthy();
        expect(button?.textContent).toEqual("Apply Now");
    });

    it('renders no application - guest user', async () => {
        act(() => {
            root.render(
                <MemoryRouter>
                    <Provider store={guestUserStore}>
                        <ScholarshipApplyButton scholarship={DEFAULT_CRYPTO_SCHOLARSHIP} />
                    </Provider>
                </MemoryRouter>
            );
        });
        await runAllPromises();

        expect(container.children).toBeTruthy();
        const button = container.querySelector('button.ScholarshipApplyButton');
        const buttonLink = container.querySelector('button.ScholarshipApplyButton a');
        expect(button?.textContent).toEqual("Apply Now");
        expect(buttonLink).toBeTruthy();
        // once the ScholarshipApplyButton can take location props, we can use toEqual instead of toContain
        expect(buttonLink?.getAttribute('href')).toContain(`/register?redirect=`);
    });

});
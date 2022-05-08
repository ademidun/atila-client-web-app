import React from "react";
import ReactDOM from 'react-dom';
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
let container: ReactDOM.Container;

mockApi.initializeMocks();
describe('<ScholarshipApplyButton />', () => {

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
      });
      
      afterEach(() => {
        document.body.removeChild(container);
      });

    it('renders without crashing - Logged In and apply now works', async () => {
        // TODO find a way to pass location prop to ScholarshipApplyButton
        // Typescript keeps complaining when we try to pass the location props
        act(() => {    ReactDOM.render(<MemoryRouter>
            <Provider store={loggedInStore}>
            <ScholarshipApplyButton 
                scholarship={DEFAULT_CRYPTO_SCHOLARSHIP}
                 />
            </Provider>
            </MemoryRouter>, container);  });
        await runAllPromises();

        const button = container.querySelector('button.ScholarshipApplyButton');
        expect(button).toBeTruthy();
        expect(button?.textContent).toEqual("Apply Now");
    });

    it('renders no application - guest user', async () => {
        // TODO find a way to pass location prop to ScholarshipApplyButton
        // Typescript keeps complaining when we try to pass the location props
        act(() => {    ReactDOM.render(<MemoryRouter>
            <Provider store={guestUserStore}>
            <ScholarshipApplyButton scholarship={DEFAULT_CRYPTO_SCHOLARSHIP} />
            </Provider>
            </MemoryRouter>, container);  });
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
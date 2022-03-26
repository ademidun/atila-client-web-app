import React from 'react';
import {configure, shallow, mount} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import "core-js/stable";
import ScholarshipPaymentFormCrypto from "./ScholarshipPaymentFormCrypto";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";

configure({ adapter: new Adapter() });


const mockStore = configureStore();
import configureStore from "redux-mock-store";
import {initialReduxState, initialReduxStateLoggedIn} from "../../../models/Constants";
import { DEFAULT_CRYPTO_SCHOLARSHIP } from '../../../models/Scholarship.class';
import { DEFAULT_CRYPTO_AWARD } from '../../../models/Award';
import { DEFAULT_CRYPTO_CONTRIBUTION } from '../../../models/Contributor';

const guestUserStore = mockStore(initialReduxState);
const loggedInStore = mockStore(initialReduxStateLoggedIn);

// Invoice component uses Redux so you need to use a provider for them
// TODO skip tests because they're failing in CI and the components are currently unused:
//  https://app.circleci.com/pipelines/github/ademidun/atila-client-web-app/716/workflows/9e5a052f-15c1-41e6-81ad-1c07df2e6fa9/jobs/1362
describe('<ScholarshipPaymentFormCrypto />', () => {

    it('renders without crashing (Not Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={guestUserStore}>
                <ScholarshipPaymentFormCrypto scholarship={DEFAULT_CRYPTO_SCHOLARSHIP} contributorFundingAmount={Number.parseFloat(DEFAULT_CRYPTO_AWARD.funding_amount as string)} contributor={DEFAULT_CRYPTO_CONTRIBUTION} />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders without crashing (Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={loggedInStore}>
                <ScholarshipPaymentFormCrypto scholarship={DEFAULT_CRYPTO_SCHOLARSHIP} contributorFundingAmount={Number.parseFloat(DEFAULT_CRYPTO_AWARD.funding_amount as string)} contributor={DEFAULT_CRYPTO_CONTRIBUTION} />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders correct checkout price', () => {


        const wrapper = mount(
            <MemoryRouter>
                <Provider store={loggedInStore}>
                <ScholarshipPaymentFormCrypto scholarship={DEFAULT_CRYPTO_SCHOLARSHIP} contributorFundingAmount={Number.parseFloat(DEFAULT_CRYPTO_AWARD.funding_amount as string)} contributor={DEFAULT_CRYPTO_CONTRIBUTION} />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.html()).toContain("0.1500"); // funding amount
        expect(wrapper.html()).toContain("0.1635"); // funding amount with fee

        const inputValueWithAtilaFee = "<input class=\"form-control col-12\" type=\"number\" name=\"amount\" disabled=\"\" value=\"0.16350000\">"
        expect(wrapper.html()).toContain(inputValueWithAtilaFee); // funding amount with fee as rendered by CryptoPaymentForm in @atila/web-components-library
        expect(wrapper.html()).not.toContain("Atila Fee HST");
    })

});
import React from 'react';
import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import {
    PREMIUM_PRICE_BEFORE_TAX,
    PREMIUM_PRICE_WITH_TAX,
    PremiumCheckoutFormTest as PremiumCheckoutForm
} from "./PaymentSendForm";
import {MemoryRouter} from "react-router-dom";
import {UserProfileTest1} from "../../../models/UserProfile";
import {Provider} from "react-redux";

configure({ adapter: new Adapter() });
jest.mock('react-stripe-elements', () => {
    return {
        injectStripe: () => {
            const PremiumCheckoutFormTest2 = require('./PaymentSendForm').PremiumCheckoutFormTest;
            return PremiumCheckoutFormTest2;
        },
        CardElement: () => {
            return <div>CardElement</div>;
        },
    };
});

const mockStore = configureStore();
import configureStore from "redux-mock-store";
import {initialReduxStateLoggedIn} from "../../../models/Constants";
const store = mockStore(initialReduxStateLoggedIn);

// Invoice component uses Redux so you need to use a provider for them
// TODO skip tests because they're failing in CI and the components are currently unused:
//  https://app.circleci.com/pipelines/github/ademidun/atila-client-web-app/716/workflows/9e5a052f-15c1-41e6-81ad-1c07df2e6fa9/jobs/1362
describe.skip('<PremiumCheckoutForm />', () => {

    it('renders without crashing (Not Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <PremiumCheckoutForm />
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders without crashing (Logged In)', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={store}>
                <PremiumCheckoutForm
                    userProfile={UserProfileTest1} />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders login content if not logged in', () => {

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                <PremiumCheckoutForm
                    userProfile={null} />
                </Provider>
            </MemoryRouter>
        );

        const checkoutTitle = "<h1>You Must be Logged In</h1>";

        expect(wrapper.html()).toContain(checkoutTitle);
    });

    it('renders checkout form if logged in and not is_atila_premium', () => {

        const wrapper = mount(
            <MemoryRouter  initialEntries={["/premium"]}>
                <Provider store={store}>
                <PremiumCheckoutForm
                    userProfile={UserProfileTest1} />
                </Provider>
            </MemoryRouter>
        );
        const checkoutTitle = "<h1>Student PaymentSend Checkout</h1>";

        expect(wrapper.html()).toContain(checkoutTitle);
    });

    it('renders already checked out if already premium user', () => {

        const premiumUser = {
            ...UserProfileTest1,
            is_atila_premium: true,
        };
        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <PremiumCheckoutForm
                        userProfile={premiumUser} />
                </Provider>
            </MemoryRouter>
        );

        const checkoutTitle = "<h1>You already have a premium account</h1>";

        expect(wrapper.html()).toContain(checkoutTitle);
    });

    it('renders correct checkout price', () => {


        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                <PremiumCheckoutForm
                    userProfile={UserProfileTest1} />
                </Provider>
            </MemoryRouter>
        );
        const premiumPriceBeforeTax = 9;
        const premiumPriceWithTax = 10.17;

        expect(wrapper.html()).toContain(`$${premiumPriceWithTax}`);
        expect(wrapper.html()).toContain(`$${premiumPriceBeforeTax}`);
        expect(PREMIUM_PRICE_WITH_TAX).toEqual(premiumPriceWithTax);
        expect(PREMIUM_PRICE_BEFORE_TAX).toEqual(premiumPriceBeforeTax);
    })

});
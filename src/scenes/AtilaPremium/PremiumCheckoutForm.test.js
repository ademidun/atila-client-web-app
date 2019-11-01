import React from 'react';
import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import {
    PREMIUM_PRICE_BEFORE_TAX,
    PREMIUM_PRICE_WITH_TAX,
    PremiumCheckoutFormTest as PremiumCheckoutForm
} from "./PremiumCheckoutForm";
import {MemoryRouter} from "react-router-dom";
import {UserProfileTest1} from "../../models/UserProfile";
import SubscribeMailingList from "../../components/SubscribeMailingList";
import {Provider} from "react-redux";

configure({ adapter: new Adapter() });
jest.mock('react-stripe-elements', () => {
    return {
        injectStripe: () => {
            const PremiumCheckoutFormTest2 = require('./PremiumCheckoutForm').PremiumCheckoutFormTest;
            return PremiumCheckoutFormTest2;
        },
        CardElement: () => {
            return <div>CardElement</div>;
        },
    };
});

const mockStore = configureStore();
import configureStore from "redux-mock-store";
import {ReduxStateLoggedIn} from "../../models/Constants";
const store = mockStore(ReduxStateLoggedIn);

// Invoice component uses Redux so you need to use a provider for them
describe('<PremiumCheckoutForm />', () => {

    it('renders without crashing (Not Logged In)', () => {

        console.log('process.env.NODE_ENV', process.env.NODE_ENV);

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
                <PremiumCheckoutForm
                    userProfile={UserProfileTest1} />
            </MemoryRouter>
        );
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders coming soon form if not logged in', () => {

        const wrapper = mount(
            <MemoryRouter>
                <PremiumCheckoutForm
                    userProfile={null} />
            </MemoryRouter>
        );

        let childWrapper = wrapper.find(SubscribeMailingList);
        const checkoutTitle = "Atila Premium Coming Soon";

        expect(wrapper.html()).toContain(checkoutTitle);
        expect(childWrapper.exists()).toBeTruthy();
    });

    it('renders coming soon form if logged in but not is_atila_admin', () => {

        const wrapper = mount(
            <MemoryRouter>
                <PremiumCheckoutForm
                    userProfile={UserProfileTest1} />
            </MemoryRouter>
        );

        let childWrapper = wrapper.find(SubscribeMailingList);
        const checkoutTitle = "Atila Premium Coming Soon";

        expect(wrapper.html()).toContain(checkoutTitle);
        expect(childWrapper.exists()).toBeTruthy();
    });

    it('renders checkout form if logged in and is_atila_admin', () => {

        UserProfileTest1.is_atila_admin = true;
        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                <PremiumCheckoutForm
                    userProfile={UserProfileTest1} />
                </Provider>
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(SubscribeMailingList);
        const checkoutTitle = `<h1>Student Premium Checkout</h1>`;

        expect(wrapper.html()).toContain(checkoutTitle);
        expect(childWrapper.exists()).toBeFalsy();
    });

    it('renders correct checkout price', () => {


        UserProfileTest1.is_atila_admin = true;
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
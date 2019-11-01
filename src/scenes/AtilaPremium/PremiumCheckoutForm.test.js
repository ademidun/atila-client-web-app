import React from 'react';
import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import {PremiumCheckoutFormTest as PremiumCheckoutForm} from "./PremiumCheckoutForm";
import {MemoryRouter} from "react-router-dom";
import {UserProfileTest1} from "../../models/UserProfile";
import SubscribeMailingList from "../../components/SubscribeMailingList";

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
                <PremiumCheckoutForm
                    userProfile={UserProfileTest1} />
            </MemoryRouter>
        );
        let childWrapper = wrapper.find(SubscribeMailingList);
        const checkoutTitle = `<h1>Student Premium Checkout</h1>`;

        expect(wrapper.html()).toContain(checkoutTitle);
        expect(childWrapper.exists()).toBeFalsy();
    });

});
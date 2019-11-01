import {configure, mount, shallow} from "enzyme";
import Pricing from "./Pricing";
import React from "react";
import {PREMIUM_PRICE_BEFORE_TAX, PREMIUM_PRICE_WITH_TAX} from "./PremiumCheckoutForm";
import Adapter from 'enzyme-adapter-react-16';
import {MemoryRouter} from "react-router-dom";
configure({ adapter: new Adapter() });

describe('<Pricing />', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <Pricing />
            </MemoryRouter>
            );

        expect(wrapper.html()).toBeTruthy();

    });

    it('renders correct price', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Pricing />
            </MemoryRouter>
        );
        const premiumPriceBeforeTax = 9;
        const premiumPriceWithTax = 10.17;

        expect(wrapper.html()).not.toContain(`$${premiumPriceWithTax}`);
        expect(wrapper.html()).toContain(`$${premiumPriceBeforeTax}`);
        expect(PREMIUM_PRICE_BEFORE_TAX).toEqual(premiumPriceBeforeTax);
    });
});
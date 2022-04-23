import {configure, mount, shallow} from "enzyme";
import Pricing from "./Pricing";
import React from "react";
import {PREMIUM_PRICE_BEFORE_TAX} from "./ScholarshipPayment/ScholarshipPaymentFormCreditCard";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
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

    // TODO remove skip when we introduce new pricing mechanism
    it.skip('renders correct price', () => {
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
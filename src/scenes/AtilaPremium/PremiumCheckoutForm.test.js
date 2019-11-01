import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import {PremiumCheckoutFormTest as PremiumCheckoutForm} from "./PremiumCheckoutForm";
import {MemoryRouter} from "react-router-dom";
import {UserProfileTest1} from "../../models/UserProfile";

configure({ adapter: new Adapter() });

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

});
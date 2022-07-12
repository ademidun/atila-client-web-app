import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import "core-js/stable";
import configureStore from "redux-mock-store";
import {initialReduxStateLoggedIn} from "../../models/Constants";
import {Provider} from "react-redux";
import {MemoryRouter} from "react-router-dom";
import ScholarshipAddEdit from './ScholarshipAddEdit';
import ScholarshipPaymentForm from '../Payment/ScholarshipPayment/ScholarshipPaymentForm';
import { DEFAULT_AWARD } from '../../models/Award';


configure({ adapter: new Adapter() });
const mockStore = configureStore();
const store = mockStore(initialReduxStateLoggedIn);
jest.mock('../Payment/ScholarshipPayment/ScholarshipPaymentForm', () => (props: any) => {
    return <>{props.children}</>
})

describe('<ScholarshipAddEdit />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(
            <MemoryRouter>
                <Provider store={store}>
                    <ScholarshipAddEdit />
                </Provider>
            </MemoryRouter>
            );
            expect(wrapper.html()).toBeTruthy();
    });

    it('contribution amount matches ', () => {

        const wrapper = mount(<MemoryRouter>
            <Provider store={store}>
                <ScholarshipAddEdit match={{ path: '/scholarship/add' }} />
            </Provider>
        </MemoryRouter>);

        const is_atila_direct_application = "is_atila_direct_application"
        wrapper.find(`input[name="${is_atila_direct_application}"]`)
               .simulate('change', {
                    target: { name: is_atila_direct_application, checked: true, type: "checkbox" },
                    stopPropagation: () => {},
                })
        wrapper.update(); 


        const fundingButton = wrapper.find('div.ant-steps-item-title').last();
        fundingButton.simulate('click');
        wrapper.update(); 

        const scholarshipPaymentForm = wrapper.find(ScholarshipPaymentForm);
        expect(scholarshipPaymentForm.props().contributor.funding_amount).toEqual(DEFAULT_AWARD.funding_amount);

    });

});
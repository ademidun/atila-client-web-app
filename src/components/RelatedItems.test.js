import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import SearchApi from "../services/SearchAPI";
import RelatedItems from "./RelatedItems";
import {ScholarshipEngineering} from "../models/Scholarship";
import {BlogWhatIsAtila} from "../models/Blog";
import {MemoryRouter} from "react-router-dom";
import {EssayIveyApplication} from "../models/Essay";
import {relatedItems} from "../models/Constants";

configure({ adapter: new Adapter() });

const mockRelatedProducts = `
<div>
    <div>
        <h3>${relatedItems[0].title}</h3>  
        <h4>${relatedItems[0].slug}</h4>
        <p>${relatedItems[0].description}</p>  
    </div>
    <div>
        <h3>${relatedItems[1].title}</h3>  
        <h4>${relatedItems[1].slug}</h4>
        <p>${relatedItems[1].description}</p>  
    </div>
    <div>
        <h3>${relatedItems[2].title}</h3>  
        <h4>${relatedItems[2].slug}</h4>
        <p>${relatedItems[2].description}</p>  
    </div>
</div>
`;

jest.mock('@algolia/recommend-react', () => ({
    RelatedProducts: () => mockRelatedProducts
}));


describe('<RelatedItems />', () => {

    it('renders without crashing', () => {

        const wrapper = shallow(<RelatedItems id={1}
                                              itemType={'blog'}
        />);
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders 3 related Items', () => {

        const wrapper = mount(
            <MemoryRouter>
                <RelatedItems id={1} itemType={'blog'} />
            </MemoryRouter>
        );

        expect(wrapper.find(RelatedItems).html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find(RelatedItems).html()).toContain(ScholarshipEngineering.description);
        expect(wrapper.find(RelatedItems).html()).toContain(EssayIveyApplication.slug);
    });

});
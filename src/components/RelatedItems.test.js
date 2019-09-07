import React from 'react';
import {configure, mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import "core-js/stable";
import SearchApi from "../services/SearchAPI";
import RelatedItems from "./RelatedItems";
import {ScholarshipEngineering} from "../models/Scholarship";
import {BlogWhatIsAtila} from "../models/Blog";
import {genericItemTransform} from "../services/utils";
import {MemoryRouter} from "react-router-dom";
import {EssayIveyApplication} from "../models/Essay";


configure({ adapter: new Adapter() });

const relatedItems = [
    BlogWhatIsAtila,
    EssayIveyApplication,
    ScholarshipEngineering].map((item, index) => {
        return {
            ...genericItemTransform(item),
            id: index
            // React components require unique Ids (usually index shouldn't be the ID but its fine for testing)
        }
});

jest.mock('../services/SearchAPI');
SearchApi.relatedItems.mockImplementation(() => Promise.resolve({ data: { items: relatedItems } } ));


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

        let childWrapper = wrapper.find(RelatedItems);
        childWrapper.instance().setState({ relatedItems: relatedItems, isLoadingRelatedItems: false });
        childWrapper.update();

        expect(wrapper.find(RelatedItems).html()).toContain(BlogWhatIsAtila.title);
        expect(wrapper.find(RelatedItems).html()).toContain(ScholarshipEngineering.description);
        expect(wrapper.find(RelatedItems).html()).toContain(EssayIveyApplication.slug);

    });

});
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { convertDynamicQueryToQueryList, convertQueryListToDynamicQuery } from "./QueryBuilderHelper";

configure({ adapter: new Adapter() });

const EXPECTED_QUERY_LIST = [
    {
        "id": "xocad499",
        "queryType": "and",
        "queryData": {
            "other_demographic": "STEM"
        }
    },
    {
        "id": "avaadl9l",
        "queryType": "and",
        "queryData": {
            "other_demographic": "Women"
        }
    },
    {
        "id": "ylp48onc",
        "queryType": "or",
        "queryData": {
            "eligible_schools": "University of Toronto"
        }
    },
    {
        "id": "o3mysztg",
        "queryType": "or",
        "queryData": {
            "eligible_programs": "Nursing"
        }
    },
    {
        "id": "c7an0c48",
        "queryType": "and",
        "queryData": {
            "eligible_programs": "Medicine"
        }
    }
]

const EXPECTED_QUERY_OBJECT  = {
    "other_demographic": "STEM",
    "$and": [
        {
            "other_demographic": "Women"
        }
    ],
    "$or": [
        {
            "eligible_schools": "University of Toronto"
        },
        {
            "eligible_programs": "Nursing"
        }
    ],
    "eligible_programs": "Medicine"
}

describe('QueryBuilderHelper', () => {

    it('transforms a query list into a dynamic query object', () => {

        let actualQueryList = convertDynamicQueryToQueryList(EXPECTED_QUERY_OBJECT);
        actualQueryList = actualQueryList.map(query => delete query.id);

        // Don't use the ID when comparing objects because it is randomly generated for updating state
        const EXPECTED_QUERY_LIST_WITHOUT_ID = EXPECTED_QUERY_LIST.map(query => delete query.id);
        expect(actualQueryList).toEqual(EXPECTED_QUERY_LIST_WITHOUT_ID);
    });

    it('transforms a dynamic query object into a dynamic query list', () => {

        const actualQueryObject = convertQueryListToDynamicQuery(EXPECTED_QUERY_LIST);
        expect(actualQueryObject).toEqual(EXPECTED_QUERY_OBJECT);
    });

});
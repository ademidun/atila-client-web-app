import {ScholarshipGeneral} from "../models/Scholarship";
import ScholarshipsAPI from "./ScholarshipsAPI";

jest.mock("./utils", () => {
    return {
        ...(jest.requireActual("./utils")),
        makeXHRRequestAsPromise: () => Promise.reject({
            status: 400,
            statusText: '',
            response: {error: 'Mocking XHR'},
        }),
        getGuestUserId: () => 'randomGuestUserId123',
    }
});
fdescribe('ScholarshipAPI', () => {

    test('cleanScholarship() should cast all empty string values generated' +
        ' from form inputs into Boolean false',
        () => {

            const scholarship = {
                ScholarshipGeneral,
                international_students_eligible: '',
                female_only: '',
                is_not_available: '',
            };
            const cleanScholarship = ScholarshipsAPI.cleanScholarship(scholarship);
            ['international_students_eligible', 'female_only', 'is_not_available']
                .forEach(field => {
                    expect(cleanScholarship[field]).toEqual(false);
                    expect(cleanScholarship[field]).not.toEqual('');
            })
        });
});
import MockAdapter from "axios-mock-adapter/types";
import Environment from "../../Environment";

import MentorsList from './MentorsList.json';

export function addMentorshipMock(mock: MockAdapter) {
    
    let mentorsApiUrl = `${Environment.apiUrl}/mentorship/`;

    mock.onGet(mentorsApiUrl).reply(200, MentorsList);
    let mentorsFilter = new RegExp(`${mentorsApiUrl}mentors/\\?username=.+`);
    
    mock.onGet(mentorsFilter).reply(function (config) {

        let responseData = MentorsList;

        console.log({config})
        if (config.url!.includes("?username=calcom")) {
            responseData = {
                ...MentorsList,
                results: MentorsList.results.filter(mentor => mentor.schedule_url?.includes('cal.com'))
            };
            console.log({responseData})
        }
        return [
          200,
          responseData,
        ];
      });
    
    mock.onGet(mentorsFilter).reply(function (config) {

        let responseData = MentorsList;

        console.log({config})
        if (config.url!.includes("?username=calcom")) {
            responseData = {
                ...MentorsList,
                results: MentorsList.results.filter(mentor => mentor.schedule_url?.includes('cal.com'))
            };
            console.log({responseData})
        }
        return [
          200,
          responseData,
        ];
      });

      const verificationCodeResponse = {
            "discount_code": {
                "id": "0x7vqzizfqa84gyh",
                "code": "a45oifp7e9wklitd",
                "session": null
            }
    }
    
    mock.onPost(`${mentorsApiUrl}codes/verify/`).reply(200, verificationCodeResponse);

    return mock

}
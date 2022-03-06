import { Location, Scholarship } from "../../models/Scholarship.class";

export class ScholarshipUtils {
    
    /**
     * @see https://github.com/ademidun/atila-angular/blob/dfe3cbdd5d9a5870e095c089d85394ba934718b5/src/app/scholarship/add-scholarship/add-scholarship.component.ts#L681
     * @param scholarship
     * @param locationData 
     * @returns 
     */
    static initializeLocations = (scholarship: Scholarship, locationData: Array<Location>) => {

        if (scholarship.country) {
            for (let index = 0; index < scholarship.country?.length; index++) {
                let element =scholarship.country[index];
                locationData.push({
                    'country': element.name
                });
            }
        }

        if (scholarship.province) {

            for (let index = 0; index <scholarship.province?.length; index++) {
                let element =scholarship.province[index];
                locationData.push({
                    'country': element.country,
                    'province':element.name
                });
            }

        }

        if (scholarship.city) {
            for (let index = 0; index <scholarship.city.length; index++) {
                let element =scholarship.city[index];
                locationData.push({
                    'country': element.country,
                    'province':element.province,
                    'city': element.name,
                });
            }
        }

        return locationData

    };
}
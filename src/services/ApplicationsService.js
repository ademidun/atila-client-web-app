class ApplicationsService {

    /**
     * Application.responses is a object which takes form values as responses[keyName].value
     * However, using nested field might over-complicate FormDynamic Component.
     * This helper function, converts the dict into a nested object that matches the application.responses spec.
     * e.g. {key: value, key2: value} => {key2: {value: value}, key2: {value: value2}}
     * @param applicationDict
     * @param originalResponses
     */
    static transformDictToApplicationResponses = (applicationDict, originalResponses) => {

        const application = {...originalResponses};
        Object.keys(applicationDict).forEach((key) => {
            if (!application[key] || application[key].constructor !== Object) {
                application[key] = {}
            }
            application[key].value= applicationDict[key];
        });

        return application;
    };

    /**
     * Takes the Application.responses data from the API which is a json string.
     * and returns the application[questionKey].value as a dictionary object,
     * making it easier for DynamicForm and updateForm() work without worrying about nesting.
     * @param originalResponses
     */

    static transformApplicationResponsesToDict = (originalResponses) => {

        const originalResponsesParsed = JSON.parse(originalResponses);

        const applicationDict = {};
        Object.keys(originalResponsesParsed).forEach((key) => {
            applicationDict[key] = originalResponsesParsed[key].value;

        });

        return applicationDict;
    };

}


export default ApplicationsService;
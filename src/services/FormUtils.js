import { nestedFieldUpdate } from "./utils";

export class FormUtils {

    /**
     * Given an arbitrary model from state, perform updates to the model using the form captured in event
     * TODO: use the same logic for ConactAddEdit and ScholarshipAddEdit
     * @param {*} model 
     * @param {*} event 
     * @returns 
     */
    static updateModelUsingForm = (model, event) => {
        let value = event.target.value;
        let eventName = event.target.name;

        if (event.target.type==='checkbox'){
            value = event.target.checked
        }
        if (event.stopPropagation) {
            // Radio button needed to be clicked twice for change to be reflected in the DOM
            // https://github.com/facebook/react/issues/3446#issuecomment-82751540
            // https://stackoverflow.com/a/48425083/5405197
            event.stopPropagation();
        }

        if (eventName.includes('.')) {
            model = nestedFieldUpdate(model, eventName, value);
        }
        else {

            if ( Array.isArray(model[eventName]) && !Array.isArray(value) ) {
                model[eventName].push(value);
            } else {
                model[eventName] = value;
            }
        }

        return model

    };
}
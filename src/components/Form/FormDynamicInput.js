import {prettifyKeys} from "../../services/utils";
import React from "react";
import ArrayEdit from "../ArrayEdit";
import AutoComplete from "../AutoComplete";
import PropTypes from "prop-types";
import {InputConfigPropType} from "../../models/Utils";

function FormDynamicInput({model, onUpdateForm, inputConfig}) {

    const {type, keyName, html, suggestions, className} = inputConfig;
    let {placeholder} = inputConfig;
    let inputForm = null;

    if (!placeholder) {
        placeholder = prettifyKeys(keyName);
    }

    // to prevent null value on inputs (controlled inputs)
    model[keyName] = model[keyName] || '';
    switch (type) {
        case 'textarea':
            inputForm = (
                <textarea placeholder={placeholder}
                          className="col-12 mb-3 form-control"
                          name={keyName}
                          value={model[keyName]}
                          onChange={onUpdateForm}
                />
            );
            break;
        case 'checkbox':
            inputForm = (
                <div className="col-12 mb-3">
                    <label htmlFor={keyName} className="mr-3">
                        {placeholder}
                    </label>
                    <input placeholder={placeholder}
                           type="checkbox"
                           name={keyName}
                           value={model[keyName]}
                           onChange={onUpdateForm}
                    />
                </div>
            );
            break;
        case 'autocomplete':
            inputForm = (

                <React.Fragment>
                    <ArrayEdit itemsList={model[keyName]}
                               keyName={keyName}
                               model={model}
                               onUpdateItemsList={onUpdateForm}/>
                    <AutoComplete suggestions={suggestions}
                                  placeholder={placeholder}
                                  onSelected={onUpdateForm}
                                  keyName={keyName}/>
                </React.Fragment>
            );
            break;
        default:
            inputForm = (
                <input placeholder={placeholder}
                       className="col-12 mb-3 form-control"
                       name={keyName}
                       value={model[keyName]}
                       onChange={onUpdateForm}
                       type={type}
                />);
    }

    inputForm = (
        <div className={`w-100${className ? ` ${className}` : ''}`}>
            {html && html(model)}
            {inputForm}
        </div>
    );

    return inputForm;

}

FormDynamicInput.propTypes = {
    model: PropTypes.shape({}).isRequired,
    onUpdateForm: PropTypes.func.isRequired,
    inputConfig: InputConfigPropType.isRequired,
};

export default FormDynamicInput
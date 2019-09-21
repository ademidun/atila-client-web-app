import React from "react";
import PropTypes from 'prop-types';
import {InputConfigPropType} from "../models/Utils";
import AutoComplete from "./AutoComplete";
import {toTitleCase} from "../services/utils";

function FormDynamicInput({model, onUpdateForm, inputConfig}) {

    const { type, keyName, html, suggestions, className } = inputConfig;
    let { placeholder } = inputConfig;
    let inputForm = null;

    if (!placeholder) {
        placeholder = toTitleCase(keyName);
    }
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
                    <label htmlFor={keyName}>{JSON.stringify(model[keyName], null, 4)}</label>
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
        <div className={`w-100 ${className}`}>
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

function FormDynamic({model, onUpdateForm, inputConfigs, onSubmit, formError}) {
    return (
        <form className="row p-3 form-group" onSubmit={onSubmit}>
            {inputConfigs.map(config => <FormDynamicInput key={config.keyName}
                                                          model={model}
                                                          inputConfig={config}
                                                          onUpdateForm={onUpdateForm} /> )}

            {formError &&
            <div className="text-danger">
                <h3>Errors with your Form</h3>
                <pre className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
                            {formError}
                        </pre>
            </div>

            }
        </form>
    )
}

FormDynamic.defaultProps = {
    onSubmit: (event) => event.preventDefault(),
    formError: null,
};

FormDynamic.propTypes = {
    model: PropTypes.shape({}).isRequired,
    onUpdateForm: PropTypes.func.isRequired,
    inputConfigs: PropTypes.arrayOf(InputConfigPropType).isRequired,
    onSubmit: PropTypes.func,
    formError: PropTypes.shape({}),
};

export default FormDynamic
import React from "react";
import PropTypes from 'prop-types';
import {InputConfigPropType} from "../models/Utils";

function FormDynamicInput({model, onUpdateForm, inputConfig}) {

    const { type, key, placeholder, html } = inputConfig;

    let inputForm = null;
    switch (type) {
        case 'textarea':
            inputForm = (
                <textarea placeholder={placeholder}
                          className="col-12 mb-3 form-control"
                          name={key}
                          value={model[key]}
                          onChange={onUpdateForm}
                />
            );
            break;
        case 'checkbox':
            inputForm = (
                <div className="col-12 mb-3">
                    <label htmlFor={key} className="mr-3">
                        {placeholder}
                    </label>
                    <input placeholder={placeholder}
                           type="checkbox"
                           name={key}
                           value={model[key]}
                           onChange={onUpdateForm}
                    />
                </div>
            );
            break;
        default:
            inputForm = (
                <input placeholder={placeholder}
                       className="col-12 mb-3 form-control"
                       name={key}
                       value={model[key]}
                       onChange={onUpdateForm}
                       type={type}
                />);
    }

    if (html) {
        inputForm = (
            <React.Fragment>
                {html}
                {inputForm}
            </React.Fragment>
        )
    }

    return inputForm;

}
FormDynamicInput.propTypes = {
    model: PropTypes.shape({}).isRequired,
    onUpdateForm: PropTypes.func.isRequired,
    inputConfig: InputConfigPropType.isRequired,
};

function FormDynamic({model, onUpdateForm, inputConfigs, onSubmit}) {
    return (
        <form className="row p-3 form-group" onSubmit={onSubmit}>
            {inputConfigs.map(config => <FormDynamicInput key={config.key}
                                                          model={model}
                                                          inputConfig={config}
                                                          onUpdateForm={onUpdateForm} /> )}

            {onSubmit && <button type="submit" onClick={onSubmit}>Submit</button>}
        </form>
    )
}

FormDynamic.defaultProps = {
    onSubmit: (event) => event.preventDefault()
};

FormDynamic.propTypes = {
    model: PropTypes.shape({}).isRequired,
    onUpdateForm: PropTypes.func.isRequired,
    inputConfigs: PropTypes.arrayOf(InputConfigPropType).isRequired,
    onSubmit: PropTypes.func,
};

export default FormDynamic
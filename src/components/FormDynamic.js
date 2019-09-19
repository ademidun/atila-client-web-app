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
                {html(model)}
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

function FormDynamic({model, onUpdateForm, inputConfigs, onSubmit, formError}) {
    return (
        <form className="row p-3 form-group" onSubmit={onSubmit}>
            {inputConfigs.map(config => <FormDynamicInput key={config.key}
                                                          model={model}
                                                          inputConfig={config}
                                                          onUpdateForm={onUpdateForm} /> )}

            {formError &&
                <div className="text-danger">
                    <h3>Errors with your Form</h3>
                    <pre className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(formError, null, 4)}
                        </pre>
                </div>

            }
            {onSubmit &&
            <div className="col-12">
                <button type="submit"
                        className="btn btn-primary"
                        onClick={onSubmit}>Submit</button>
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
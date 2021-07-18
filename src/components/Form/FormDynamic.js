import React from "react";
import PropTypes from 'prop-types';
import {InputConfigPropType} from "../../models/Utils";
import FormDynamicInput from "./FormDynamicInput";

function FormDynamic({model, loggedInUserProfile, onUpdateForm, inputConfigs, onSubmit, formError}) {
    return (
        <form className="row p-3 form-group text-left" onSubmit={onSubmit}>
            {inputConfigs.map(config => <FormDynamicInput key={config.keyName}
                                                          model={model}
                                                          inputConfig={config}
                                                          onUpdateForm={onUpdateForm}
                                                          loggedInUserProfile={loggedInUserProfile} /> )}

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
    formError: PropTypes.string,
};

export default FormDynamic
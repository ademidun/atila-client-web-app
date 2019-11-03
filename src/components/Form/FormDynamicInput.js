import {prettifyKeys} from "../../services/utils";
import React from "react";
import ArrayEdit from "../ArrayEdit";
import AutoComplete from "../AutoComplete";
import PropTypes from "prop-types";
import {InputConfigPropType} from "../../models/Utils";
import LocationSearchInput from "../LocationSearchInput/LocationSearchInput";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";



const editorChange = ( event, editor, name, updateForm ) => {
    const newEvent = {
        target: {
            name: name,
            value: editor.getData()
        }
    };
    updateForm(newEvent);
};

function FormDynamicInput({model, onUpdateForm, inputConfig}) {

    const {type, keyName, html, suggestions, className, options, valueDisplay} = inputConfig;
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
                           checked={model[keyName]}
                           onChange={onUpdateForm}
                    />
                </div>
            );
            break;
        case 'select':
            inputForm = (
                <div className="mb-3">
                    <label htmlFor={keyName} className="float-left">
                        {placeholder}
                    </label>
                    <select
                        className="form-control"
                        name={keyName}
                        value={model[keyName]||placeholder}
                        onChange={onUpdateForm}
                    >
                        <option key={placeholder} disabled hidden>{placeholder}</option>
                        {options.map(option => (<option key={option}>{option}</option>))}
                    </select>
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
        case 'autocomplete_single':
            inputForm = (

                <React.Fragment>
                    <label htmlFor={keyName}>
                        {placeholder}:{' '}
                    </label> <strong> {model[keyName]} </strong>
                    <AutoComplete suggestions={suggestions}
                                  placeholder={placeholder}
                                  onSelected={onUpdateForm}
                                  value={model[keyName]}
                                  keyName={keyName}/>
                </React.Fragment>
            );
            break;
        case 'location':
            let valueDisplayResult = '';

            if(valueDisplay) {
                valueDisplayResult = valueDisplay(model);
            }
            inputForm = (
                <React.Fragment>
                    {
                        valueDisplayResult &&
                        <React.Fragment>
                            <label htmlFor={keyName}>
                                {placeholder}:{' '}
                            </label> <strong> {valueDisplayResult} </strong>
                        </React.Fragment>
                    }

                    <LocationSearchInput placeholder={placeholder}
                                         value={valueDisplayResult}
                                         keyName={keyName}
                                         onSelected={onUpdateForm} />
                </React.Fragment>
            );
            break;
        case 'html_editor':

            inputForm = (
                <React.Fragment>
                    <CKEditor
                        editor={ClassicEditor}
                        data={model[keyName]}
                        onChange={ (event, editor) => editorChange(event, editor, keyName, onUpdateForm) }
                    />
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
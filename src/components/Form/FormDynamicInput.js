import {nestedFieldGet, prettifyKeys} from "../../services/utils";
import React from "react";
import ArrayEdit from "../ArrayEdit";
import AutoComplete from "../AutoComplete";
import PropTypes from "prop-types";
import {InputConfigPropType} from "../../models/Utils";
import LocationSearchInput from "../LocationSearchInput/LocationSearchInput";
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";


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

    const { type, keyName, html, suggestions, className,
        options, valueDisplay, isHidden, hideLabel } = inputConfig;
    let {placeholder} = inputConfig;
    let inputForm = null;

    if(isHidden && isHidden(model)) {
        return null
    }

    if (!placeholder) {
        placeholder = prettifyKeys(keyName);
    }

    // to prevent null value on inputs (controlled inputs)

    let modelValue = model[keyName];
    if (keyName.includes('.')) {
        modelValue = nestedFieldGet(model, keyName);
    }

    // to fix controlled components issue: https://fb.me/react-controlled-components
    modelValue = modelValue || '';

    switch (type) {
        case 'textarea':
            inputForm = (
                <textarea placeholder={placeholder}
                          className="col-12 mb-3 form-control"
                          name={keyName}
                          value={modelValue}
                          onChange={onUpdateForm}
                />
            );
            break;
        case 'checkbox':
            inputForm = (
                <div className="col-12 mb-3">
                    {!hideLabel &&
                    <label htmlFor={keyName} className="mr-3">
                        {placeholder}
                    </label>
                    }
                    <input placeholder={placeholder}
                           type="checkbox"
                           name={keyName}
                           checked={modelValue}
                           onChange={onUpdateForm}
                    />
                </div>
            );
            break;
        case 'select':
            inputForm = (
                <div className="mb-3">
                    {!hideLabel &&
                    <label htmlFor={keyName} className="float-left">
                        {placeholder}
                    </label>}
                    <select
                        className="form-control"
                        name={keyName}
                        value={modelValue||placeholder}
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
                    <ArrayEdit itemsList={modelValue}
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
                    </label> <strong> {modelValue} </strong>
                    <AutoComplete suggestions={suggestions}
                                  placeholder={placeholder}
                                  onSelected={onUpdateForm}
                                  value={modelValue}
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
                <div className="mb-3">
                    <CKEditor
                        editor={InlineEditor}
                        data={modelValue}
                        onChange={ (event, editor) => editorChange(event, editor, keyName, onUpdateForm) }
                    />
                </div>
            );
            break;
        default:
            inputForm = (
                <input placeholder={placeholder}
                       className="col-12 mb-3 form-control"
                       name={keyName}
                       value={modelValue}
                       onChange={onUpdateForm}
                       type={type}
                />);
    }

    inputForm = (
        <div className={`w-100 ${className ? ` ${className}` : ''} + ${inputConfig.error ? ' input-error' : ''}`}>
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
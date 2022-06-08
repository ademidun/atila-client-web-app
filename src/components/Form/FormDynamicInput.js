import {nestedFieldGet, prettifyKeys, transformListToValueLabelList} from "../../services/utils";
import React from "react";
import {DatePicker, Select, AutoComplete, Checkbox, Radio} from 'antd';
import PropTypes from "prop-types";
import {InputConfigPropType} from "../../models/Utils";
import LocationSearchInput from "../LocationSearchInput/LocationSearchInput";
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import "./FormDynamicInput.scss";
import FileInput from "./FileInput";
import {emojiDictionary} from "../../models/Constants";
import moment from "moment";
import FormInputConstants from "../../models/FormInputConstants";

const { Option } = Select;

const editorChange = ( event, editor, name, updateForm ) => {
    const newEvent = {
        target: {
            name: name,
            value: editor.getData()
        }
    };
    updateForm(newEvent);
};

const antDesignChange = ( name, value, updateForm ) => {
    const newEvent = {
        target: {
            name,
            value
        }
    };
    updateForm(newEvent);
};

const datePickerChange = (name, moment, updateForm) => {
    const newEvent = {
        target: {
            name,
            value: moment.toISOString()
        }
    };
    updateForm(newEvent);
}

function FormDynamicInput({model, onUpdateForm, inputConfig, loggedInUserProfile}) {

    const { type, keyName, html, suggestions, className,
        options, valueDisplay, isHidden, hideLabel, label, disabled, skipPrettifyKeys, renderOption } = inputConfig;
    console.log('[grace] input config: ');
    console.log({inputConfig});
    let {placeholder} = inputConfig;
    let inputForm = null;

    if(isHidden && isHidden(model, loggedInUserProfile)) {
        return null;
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

    if (type === "autocomplete") {
        if (!Array.isArray(modelValue)) {
            modelValue = [];
        }
    }

    switch (type) {
        case 'textarea':
            inputForm = (
                <textarea placeholder={placeholder}
                          className="col-12 mb-3 form-control"
                          name={keyName}
                          value={modelValue}
                          onChange={onUpdateForm}
                          disabled={disabled}
                />
            );
            break;

        case 'datepicker':
            inputForm = (
                <div>
                    <DatePicker showTime={{format: 'HH:mm'}}
                                onChange={moment => datePickerChange(keyName, moment, onUpdateForm)}
                                disabled={disabled}
                                placeholder={placeholder}
                                value={moment(modelValue)}
                                size={"large"}
                                allowClear={false}
                    />
                </div>
            )
            break;

        case 'checkbox':
            inputForm = (
                <div>
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
                           disabled={disabled}
                    />
                </div>
            );
            break;
        case 'checkbox_group':
            inputForm = (
                <div className="mb-3">
                    {placeholder && <label htmlFor={keyName}>
                        {placeholder}
                    </label>}
                    <br />
                    <Checkbox.Group options={options} onChange={(checkedValues => {
                        const syntheticEvent = {
                            target: {
                                value: checkedValues,
                                name: "checkbox_group_values"
                            }
                        }
                        onUpdateForm(syntheticEvent);
                    })}/>
                </div>
            )
            break;
        case 'radio_group':
            inputForm = (
                <div className="mb-3">
                    {placeholder && <label htmlFor={keyName}>
                        {placeholder}
                    </label>}
                    <br />
                    <Radio.Group onChange={onUpdateForm}>
                        {options.map((option, index) => {
                            return <Radio key={index} value={option}>{option}</Radio>
                        })}
                    </Radio.Group>
                </div>
            )
            break;
        case 'select':
            inputForm = (
                <div className="mb-3">
                    {!hideLabel &&
                    <label htmlFor={keyName} className="float-left">
                        {placeholder}
                    </label> }
                    <select
                        className="form-control"
                        name={keyName}
                        value={modelValue||placeholder}
                        onChange={onUpdateForm}
                        disabled={disabled}
                    >
                        <option key={placeholder} disabled hidden>{placeholder}</option>
                        {options.map(option => (<option key={option} value={option}>{renderOption ? renderOption(option) : option}</option>))}
                    </select>
                </div>
            );
            break;
        case 'autocomplete':
            inputForm = (
                <React.Fragment>
                    {/*When there is a value in the select field, the placeholder is hidden and user may not
                    know what value was in that field. Adding a label that displays if there is a model value,
                    fixes this problem.*/}
                    {modelValue && modelValue.length >  0 &&
                        <label htmlFor={keyName}>
                            {placeholder}:{' '}
                        </label>

                    }
                    <Select mode="tags" style={{ width: '100%' }}
                            value={modelValue}
                            placeholder={placeholder}
                            disabled={disabled}
                            onChange={(selected) => antDesignChange(keyName, selected, onUpdateForm)}>
                        {suggestions.map(suggestion => (
                            <Option key={suggestion}
                                    value={suggestion}>
                                {skipPrettifyKeys ? suggestion : prettifyKeys(suggestion)}{' '}

                                {emojiDictionary[suggestion.toLowerCase()] && emojiDictionary[suggestion.toLowerCase()]}
                            </Option>
                        ))}
                    </Select>
                </React.Fragment>
            );
            break;
        case 'autocomplete_single':
            inputForm = (

                <React.Fragment>
                    <label htmlFor={keyName}>
                        {placeholder}:{' '}
                    </label> <strong> {modelValue} </strong>
                    <br />
                    <AutoComplete options={transformListToValueLabelList(suggestions)}
                                  placeholder={placeholder}
                                  disabled={disabled}
                                  onChange={value => antDesignChange(keyName, value, onUpdateForm)}
                                  value={modelValue}
                                  style={{width: "100%"}}
                    />
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
                <div className="mb-3"
                     style={{cursor: disabled ? "not-allowed": "default"}}>
                    {label && <label htmlFor={keyName} className="float-left">
                        {label}
                    </label>}
                    <CKEditor
                        editor={InlineEditor}
                        disabled={disabled}
                        data={modelValue}
                        config={FormInputConstants.editorConfig}
                        onChange={ (event, editor) => editorChange(event, editor, keyName, onUpdateForm) }
                    />
                </div>
            );
            break;
        case 'file':
            inputForm = (<div className="mb-3">
                            {placeholder && <label htmlFor={keyName}>
                                {placeholder}
                            </label>}
                            <FileInput
                                title={placeholder}
                                type={"image,pdf"}
                                keyName={keyName}
                                filePath={`test`}
                                onChangeHandler={() => {console.log("file uploaded")}}
                            />
                        </div>)
            break;
        case 'image':
            inputForm = (<div className="col-12 my-3">
                {placeholder && <label htmlFor={keyName}>
                    {placeholder}
                </label>}
                <FileInput title={placeholder} keyName={keyName}
                           onChangeHandler={onUpdateForm}
                           type={type} uploadHint={`You can also paste the ${type} url in the text box below`} />
                {type === "image" && <img src={modelValue} alt={placeholder} width="250" className="card center-block my-3"/> }

                <div className="floating mb-3">
                    <input placeholder={placeholder}
                     disabled={disabled}
                           className="col-12 form-control floating__input"
                           name={keyName}
                           value={modelValue}
                           onChange={onUpdateForm}
                           type="url"
                    />
                    <label htmlFor="input__username" className="floating__label" data-content={placeholder}>
                            <span className="hidden--visually">
                              {placeholder}
                            </span>
                    </label>
                </div>
            </div>);
            break;
        default:
            inputForm = (
                <div className="floating mb-3">
                    <input placeholder={placeholder}
                           className="col-12 form-control floating__input"
                           name={keyName}
                           disabled={disabled}
                           value={modelValue}
                           onChange={onUpdateForm}
                           type={type}
                    />
                    <label htmlFor="input__username" className="floating__label" data-content={placeholder}>
                            <span className="hidden--visually">
                              {placeholder}
                            </span>
                    </label>
                </div>);
    }

    inputForm = (
        <div className={`FormDynamicInput w-100 ${className ? ` ${className}` : 'col-12 mb-2'} ${inputConfig.error ? ' input-error' : ''}`}>
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
import React from 'react';
import Autosuggest from 'react-autosuggest';
import './AutoComplete.scss';
import PropTypes from "prop-types";
import {emojiDictionary} from "../models/Constants";

const defaultTheme = {
    container: 'react-autosuggest__container col-12 p-0 mb-3',
    containerOpen: 'react-autosuggest__container--open',
    input: 'react-autosuggest__input',
    inputOpen: 'react-autosuggest__input--open',
    inputFocused: 'react-autosuggest__input--focused',
    suggestionsContainer: 'react-autosuggest__suggestions-container',
    suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
    suggestionsList: 'react-autosuggest__suggestions-list',
    suggestion: 'react-autosuggest__suggestion pl-3',
    suggestionFirst: 'react-autosuggest__suggestion--first',
    suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
    sectionContainer: 'react-autosuggest__section-container',
    sectionContainerFirst: 'react-autosuggest__section-container--first',
    sectionTitle: 'react-autosuggest__section-title'
};

class AutoCompleteHelper {
    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    static getSuggestionValue = suggestion => suggestion;

    static renderSuggestion = suggestion => (
        <p className="suggestion-item cursor-pointer">
            <span>{emojiDictionary[suggestion.toLowerCase()] && emojiDictionary[suggestion.toLowerCase()]} </span>
            {suggestion}
        </p>
    );
}
class AutoComplete extends React.Component {
    constructor(props) {
        super(props);

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        const { value, suggestions } = this.props;

        this.state = {
            value,
            suggestions
        };
    }

    renderInputComponent = inputProps => {

        inputProps.className += ' form-control';
        return (
            <div>
                <input{...inputProps}/>
            </div>
        );
    };

    onChange = (event, { newValue }) => {
        event.preventDefault();
        this.setState({value: newValue});
    };

    onKeyPress = (event) => {

        if (event.key === "Enter") {
            event.preventDefault();
            this.onSuggestionSelected(event, {suggestionValue: event.target.value, method: 'click'});
        }
    };



    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = ( event, suggestionArguments ) => {
        // leaving this comment so you can easily see the available properties of suggestionArguments
        // const { suggestion, suggestionValue, suggestionIndex, sectionIndex, method } = suggestionArguments;

        const { suggestionValue, method } = suggestionArguments;
        event.preventDefault();

        const { onSelected, keyName } = this.props;
        if( method==='click' ) {
            event.target.value = suggestionValue;
            event.target.name = keyName;
        }
        onSelected(event);
        this.props.onSuggestionSelected(event, suggestionArguments);
    };

    getSuggestions = value => {

        const { suggestions, getSuggestionValue, inputToSuggestion} = this.props;
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        const filteredSuggestions = inputLength === 0 ? [] : suggestions.filter(suggestion => {
            suggestion = getSuggestionValue(suggestion)
            return suggestion.toLowerCase().includes(inputValue)
        })

        // Value is a string but the items in the suggestions might be objects.
        const inputSuggestion = inputToSuggestion(value.trim());
        filteredSuggestions.unshift(inputSuggestion);

        return filteredSuggestions;
    };

    render() {
        const { value, suggestions } = this.state;
        const { keyName, placeholder, customTheme, getSuggestionValue, renderSuggestion } = this.props;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder,
            value,
            name:keyName,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
        };

        // Finally, render it!
        return (
            <Autosuggest
                id={keyName}
                theme={{...defaultTheme, ...customTheme}}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                renderInputComponent={this.renderInputComponent}
                onSuggestionSelected={this.onSuggestionSelected}
            />
        );
    }
}

AutoComplete.defaultProps = {
    value: '',
    onChange: (event) => event.preventDefault(),
    onSelected: (event) => event.preventDefault(),
    onSuggestionSelected: (event, suggestionArguments) => {},
    placeholder: '',
    customTheme: {},
    getSuggestionValue: (suggestion) => (AutoCompleteHelper.getSuggestionValue(suggestion)),
    renderSuggestion: (suggestion) => (AutoCompleteHelper.renderSuggestion(suggestion)),
    inputToSuggestion: value => value,
};

AutoComplete.propTypes = {
    value: PropTypes.string,
    suggestions: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onSelected: PropTypes.func,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    customTheme: PropTypes.shape({}),
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    inputToSuggestion: PropTypes.func.isRequired,
};

export default AutoComplete
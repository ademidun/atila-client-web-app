import React from 'react';
import Autosuggest from 'react-autosuggest';
import './AutoComplete.scss';
import PropTypes from "prop-types";
import {emojiDictionary} from "../models/Constants";
import { Highlight, connectAutoComplete } from "react-instantsearch-dom";

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

class AutoComplete extends React.Component {
    constructor(props) {
        super(props);
        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        const { value, suggestions, algoliaPowered } = this.props;

        this.state = {
            value,
            suggestions,
            algoliaPowered
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

    getSuggestionValue = hit => {
        if (this.state.algoliaPowered) {
            return hit.query;
        } else {
            return hit;
        }
    }

    renderSuggestion = hit => {
        if (this.state.algoliaPowered) {
            return <Highlight attribute="query" hit={hit} tagName="mark" />
        } else {
            return <p className="suggestion-item cursor-pointer">
                    <span>{emojiDictionary[hit.toLowerCase()] && emojiDictionary[hit.toLowerCase()]} </span>
                    {hit}
                </p>
        }
    }

    onChange = (event, { newValue }) => {
        event.preventDefault();
        this.setState({value: newValue});
    };

    onKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (this.state.algoliaPowered) {
                this.props.onSuggestionSelected(event, {suggestion: { query: this.state.value}});
            } else {
               this.onSuggestionSelected(event, {suggestionValue: event.target.value, method: 'click'});
            }
        }
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        if (this.state.algoliaPowered) {
            const { refine } = this.props;
            refine(value);
        } else {
            this.setState({
                suggestions: this.getSuggestions(value)
            });
        }
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        if (this.state.algoliaPowered) {
            const { refine } = this.props;
            refine();
        } else {
            this.setState({
                suggestions: []
            });
        }
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
        const { value, algoliaPowered } = this.state;
        const { hits, keyName, placeholder, customTheme, onSuggestionSelected, suggestions } = this.props;

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
                suggestions={algoliaPowered ? hits : suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                renderInputComponent={this.renderInputComponent}
                onSuggestionSelected={algoliaPowered? onSuggestionSelected : this.onSuggestionSelected}
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
    inputToSuggestion: value => value,
    algoliaPowered: false,
};

AutoComplete.propTypes = {
    value: PropTypes.string,
    suggestions: PropTypes.array,
    onChange: PropTypes.func,
    onSelected: PropTypes.func,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    customTheme: PropTypes.shape({}),
    onSuggestionSelected: PropTypes.func.isRequired,
    inputToSuggestion: PropTypes.func.isRequired,
    algoliaPowered: PropTypes.bool,
};

export default connectAutoComplete(AutoComplete);
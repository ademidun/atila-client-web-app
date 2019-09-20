import React from 'react';
import Autosuggest from 'react-autosuggest';
import './AutoComplete.scss';
import PropTypes from "prop-types";

const theme = {
    container: 'react-autosuggest__container col-12 p-0 mb-3',
    containerOpen: 'react-autosuggest__container--open',
    input: 'react-autosuggest__input',
    inputOpen: 'react-autosuggest__input--open',
    inputFocused: 'react-autosuggest__input--focused',
    suggestionsContainer: 'react-autosuggest__suggestions-container',
    suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
    suggestionsList: 'react-autosuggest__suggestions-list',
    suggestion: 'react-autosuggest__suggestion',
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
        this.state = {
            value: '',
            suggestions: []
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

    onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        event.preventDefault();

        const { onSelected, keyName } = this.props;
        if( method==='click' ) {
            event.target.value = suggestionValue;
            event.target.name = keyName;
        }
        onSelected(event);
        this.setState({
            value: ''
        });
    };

    getSuggestions = value => {

        const {suggestions} = this.props;
            const inputValue = value.trim().toLowerCase();
            const inputLength = inputValue.length;

            return inputLength === 0 ? [] : suggestions.filter(lang =>
                lang.toLowerCase().includes(inputValue));
        };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    getSuggestionValue = suggestion => suggestion;

    renderSuggestion = suggestion => (
        <p className="suggestion-item cursor-pointer">
            {suggestion}
        </p>
    );

    render() {
        const { value, suggestions } = this.state;
        const { keyName, placeholder } = this.props;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder,
            value,
            name:keyName,
            onChange: this.onChange
        };

        // Finally, render it!
        return (
            <Autosuggest
                id={keyName}
                theme={theme}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
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
    placeholder: '',
};

AutoComplete.propTypes = {
    value: PropTypes.string,
    suggestions: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onSelected: PropTypes.func,
    keyName: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
};

export default AutoComplete
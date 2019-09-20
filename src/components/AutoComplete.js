import React from 'react';
import Autosuggest from 'react-autosuggest';
import './AutoComplete.scss';
import PropTypes from "prop-types";

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

        const { key } = this.props;
        inputProps.className += ' form-control';
        inputProps.name = key;
        return (
            <div>
                <input{...inputProps}/>
            </div>
        );
    };

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
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
        const { key, placeholder } = this.props;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder,
            value,
            onChange: this.onChange
        };

        // Finally, render it!
        return (
            <Autosuggest
                id={key}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                renderInputComponent={this.renderInputComponent}
            />
        );
    }
}

AutoComplete.defaultProps = {
    value: '',
    onChange: (event) => event.preventDefault(),
    onUpdate: (event) => event.preventDefault(),
    key: 'AutoComplete',
    placeholder: '',
};

AutoComplete.propTypes = {
    value: PropTypes.string,
    suggestions: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onUpdate: PropTypes.func,
    key: PropTypes.string,
    placeholder: PropTypes.string,
};

export default AutoComplete
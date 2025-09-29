import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './AutoComplete.scss';
import { emojiDictionary } from "../models/Constants";
import { connectAutoComplete } from "react-instantsearch-dom";
import type { AutocompleteProvided } from 'react-instantsearch-core';

export interface Suggestion {
    value: string;
    category?: string;
    query?: string;
    [key: string]: any;
}

// Props from the user
interface OwnProps {
    value?: string;
    suggestions?: Suggestion[];
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSelected?: (event: React.FormEvent) => void;
    keyName: string;
    placeholder?: string;
    customTheme?: Record<string, string>;
    onSuggestionSelected: (event: React.FormEvent, suggestionArguments: { suggestion: Suggestion; suggestionValue?: string; method?: string }) => void;
    inputToSuggestion: (value: string) => Suggestion;
    algoliaPowered?: boolean;
    getSuggestionValue?: (suggestion: Suggestion) => string;
    renderSuggestion?: (suggestion: Suggestion) => React.ReactNode;
}

// Props for the component that gets connected to Algolia
interface ConnectProps {
    keyName?: string;
    placeholder?: string;
    customTheme?: Record<string, string>;
    algoliaPowered?: boolean;
    getSuggestionValue?: (suggestion: Suggestion) => string;
    renderSuggestion?: (suggestion: Suggestion) => React.ReactNode;
    onSuggestionSelected?: (event: React.FormEvent, suggestionArguments: { suggestion: Suggestion; suggestionValue?: string; method?: string }) => void;
    inputToSuggestion?: (value: string) => Suggestion;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSelected?: (event: React.FormEvent) => void;
    value?: string;
    suggestions?: Suggestion[];
}

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

// Create the base component that will be connected to Algolia
const BaseAutoComplete = (props: ConnectProps & AutocompleteProvided<Suggestion>) => {
    const {
        hits = [],
        refine = () => {},
        value: initialValue = '',
        suggestions = [],
        onChange = () => {},
        onSelected = () => {},
        keyName = 'search-autocomplete',
        placeholder = '',
        customTheme = {},
        onSuggestionSelected = () => {},
        inputToSuggestion = (value: string) => ({ value }),
        algoliaPowered = false,
        getSuggestionValue: propGetSuggestionValue,
        renderSuggestion: propRenderSuggestion
    } = props;

    const [currentValue, setCurrentValue] = useState(initialValue);
    const [currentSuggestions, setCurrentSuggestions] = useState<Suggestion[]>(suggestions);

    const renderInputComponent = (inputProps: any) => {
        const enhancedProps = {
            ...inputProps,
            className: `${inputProps.className} form-control`
        };
        return <div><input {...enhancedProps} /></div>;
    };

    const getSuggestionValue = (suggestion: Suggestion): string => {
        if (algoliaPowered) {
            return suggestion.query || '';
        }
        return propGetSuggestionValue ? propGetSuggestionValue(suggestion) : suggestion.value;
    };

    const defaultRenderSuggestion = (suggestion: Suggestion) => {
        if (algoliaPowered) {
            const highlightText = (text: string, query: string) => {
                // Safety check
                if (!text) return '';
                
                const parts = text.split(new RegExp(`(${query})`, 'gi'));
                return (
                    <span>
                        {parts.map((part, index) =>
                            part.toLowerCase() === query.toLowerCase() ? (
                                <mark key={index}>{part}</mark>
                            ) : (
                                part
                            )
                        )}
                    </span>
                );
            };
            return <p>{highlightText(suggestion.query || '', currentValue)}</p>;
        } else {
            const value = suggestion.value?.toLowerCase() || '';
            const emoji = emojiDictionary[value as keyof typeof emojiDictionary];
            
            return (
                <p className="suggestion-item cursor-pointer">
                    {emoji && <span>{emoji} </span>}
                    {suggestion.value}
                </p>
            );
        }
    };

    const handleChange = (event: React.FormEvent<HTMLElement>, { newValue }: { newValue: string }) => {
        setCurrentValue(newValue);
        if (onChange && event.target instanceof HTMLInputElement) {
            onChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const suggestion = inputToSuggestion(currentValue);
            const data = { suggestion, suggestionValue: currentValue, method: 'enter' };
            
            if (algoliaPowered) {
                onSuggestionSelected(event, data);
            } else {
                handleSuggestionSelected(event, { 
                    suggestion, 
                    suggestionValue: currentValue,
                    method: 'enter',
                    sectionIndex: null,
                    suggestionIndex: 0
                });
            }
        }
    };

    const handleSuggestionsFetchRequested = ({ value }: { value: string }) => {
        if (algoliaPowered) {
            refine(value);
        } else {
            setCurrentSuggestions(getSuggestions(value));
        }
    };

    const handleSuggestionsClearRequested = () => {
        if (algoliaPowered) {
            refine('');
        } else {
            setCurrentSuggestions([]);
        }
    };

    // Type for SuggestionSelectedEventData
    interface SuggestionSelectedEventData<T> {
        suggestion: T;
        suggestionValue?: string;
        suggestionIndex: number;
        sectionIndex: number | null;
        method: string;
    }

    const handleSuggestionSelected = (
        event: React.FormEvent, 
        data: SuggestionSelectedEventData<Suggestion>
    ) => {
        const { suggestion, method } = data;
        event.preventDefault();

        setCurrentValue(getSuggestionValue(suggestion));
        
        // Call onSelected with event
        onSelected(event);
        
        // Pass necessary data to onSuggestionSelected
        onSuggestionSelected(event, {
            suggestion,
            suggestionValue: getSuggestionValue(suggestion),
            method
        });
    };

    const getSuggestions = (value: string): Suggestion[] => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        if (inputLength === 0) return [];

        const filtered = suggestions.filter((sugg) => {
            const val = propGetSuggestionValue ? propGetSuggestionValue(sugg) : sugg.value;
            return val.toLowerCase().includes(inputValue);
        });

        const userInput = inputToSuggestion(value.trim());
        return [userInput, ...filtered];
    };

    const inputProps = {
        placeholder,
        value: currentValue,
        name: keyName,
        onChange: handleChange,
        onKeyPress: handleKeyPress,
    };

    return (
        <Autosuggest
            id={keyName}
            theme={{ ...defaultTheme, ...customTheme }}
            suggestions={algoliaPowered ? hits : currentSuggestions}
            onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={handleSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={propRenderSuggestion || defaultRenderSuggestion}
            inputProps={inputProps}
            renderInputComponent={renderInputComponent}
            onSuggestionSelected={handleSuggestionSelected}
        />
    );
};

// Connect the base component to Algolia
const ConnectedAutoComplete = connectAutoComplete(BaseAutoComplete);

// Create a properly typed wrapper component
const AutoComplete = (props: OwnProps) => {
  const Connected = ConnectedAutoComplete as unknown as React.ComponentType<OwnProps>;
  return <Connected {...props} />;
};

export default AutoComplete;
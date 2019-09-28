import React from "react";
import PropTypes from 'prop-types';
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import './LocationSearchInput.scss'
const MY_API_KEY = "AIzaSyA1rv9mDjuLMvxUhlXDNPqOQlCqaeuHPtg";

class LocationSearchInput extends React.Component {

    constructor(props) {
        super(props);
        const { value } = this.props;

        this.state = {
            search: "",
            value ,
        };
    }

    handleInputChange = e => {
        this.setState({search: e.target.value, value: e.target.value})
    };

    handleSelectSuggest = (geocodedPrediction, originalPrediction) => {

        const { onSelected, keyName } = this.props;
        this.setState({search: "", value: geocodedPrediction.formatted_address});
        const event = {
            preventDefault: () => {},
            target: {
                name: keyName,
                value: geocodedPrediction,
            },
        };
        onSelected(event);
    };

    renderPrediction = prediction => (
        <div className="customWrapper">
            {prediction
                ? prediction.description
                : "My custom no results text"}
        </div>
    );

    render() {
        const {search, value} = this.state;
        const { placeholder, className } = this.props;
        return (
            <ReactGoogleMapLoader
                params={{
                    key: MY_API_KEY,
                    libraries: "places,geocode",
                }}
                render={googleMaps =>
                    googleMaps && (
                        <ReactGooglePlacesSuggest
                            googleMaps={googleMaps}
                            autocompletionRequest={{
                                input: search,
                                // Optional options
                                // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                            }}
                            // Optional props
                            onSelectSuggest={this.handleSelectSuggest}
                            textNoResults="My custom no results text" // null or "" if you want to disable the no results item
                            customRender={this.renderPrediction}
                        >
                            <input
                                type="text"
                                className={className}
                                value={value}
                                placeholder={placeholder}
                                onChange={this.handleInputChange}
                            />
                        </ReactGooglePlacesSuggest>
                    )
                }
            />
        )
    }
}

LocationSearchInput.defaultProps = {
    value: '',
    keyName: '',
    placeholder: 'Search for a location',
    className: 'col-12 mb-3 form-control',
    onSelected: () => {},
};

LocationSearchInput.propTypes = {
    value: PropTypes.string,
    keyName: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onSelected: PropTypes.func,
};
export default LocationSearchInput;
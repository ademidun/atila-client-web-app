import React from 'react';
import { AutoComplete } from "antd";
import SearchApi from "../services/SearchAPI";

const START_AUTOCOMPLETE_LENGTH = 3;

class ReferredAutocomplete extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            referredByOptions: null,
            referredBy: ""
        }
    }
    updateReferredByField = (newReferredByField) => {
        const { onFieldUpdate } = this.props;

        this.setState({referredBy: newReferredByField}, ()=>{
            const { referredByOptions } = this.state

            if (newReferredByField.length < START_AUTOCOMPLETE_LENGTH) {
                this.setState({referredByOptions: null})
            } else {
                if (!referredByOptions) {
                    this.getReferredByOptions()
                }
            }

            if (onFieldUpdate) {
                onFieldUpdate(newReferredByField);
            }
        })
    };

    getReferredByOptions = () => {
        const { referredBy } = this.state;

        SearchApi
            .searchUserProfiles(referredBy)
            .then(res => {
                let { user_profiles } = res.data

                let newReferredByOptions = user_profiles.map(userProfile => ({
                    'label': userProfile.username,
                    'value': userProfile.username
                }))

                this.setState({referredByOptions: newReferredByOptions})
            })
            .catch(err => {
                console.log({err})
            })
    }

    render() {
        const { referredBy, referredByOptions } = this.state;

        return (
            <AutoComplete
                filterOption
                options={referredByOptions}
                defaultOpen={false}
                value={referredBy}
                onChange={this.updateReferredByField}
                style={{
                    width: 300,
                }}
            />
        )
    }
}


export default ReferredAutocomplete;

import React from 'react';
import { AutoComplete } from "antd";
import SearchApi from "../services/SearchAPI";

const START_AUTOCOMPLETE_LENGTH = 3;

class ReferredAutocomplete extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            referredByOptions: null,
            referred_by: ""
        }
    }
    updateReferredByField = (newReferredByField) => {
        const { onFieldUpdate } = this.props;

        this.setState({referred_by: newReferredByField}, ()=>{
            const { referredByOptions } = this.state

            if (newReferredByField.length < START_AUTOCOMPLETE_LENGTH) {
                this.setState({referredByOptions: null})
            } else {
                if (!referredByOptions) {
                    this.getReferredByOptions()
                }
            }
            onFieldUpdate(newReferredByField);
        })
    };

    getReferredByOptions = () => {
        const { referred_by } = this.state;

        SearchApi
            .searchUserProfiles(referred_by)
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
        const { referred_by, referredByOptions } = this.state;

        return (
            <AutoComplete
                filterOption
                options={referredByOptions}
                defaultOpen={false}
                name="referred_by"
                value={referred_by}
                onChange={this.updateReferredByField}
                style={{
                    width: 300,
                }}
            />
        )
    }
}


export default ReferredAutocomplete

import React from 'react';
import {Button, Switch} from "antd";

class ContactsNetworkGraphSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSettingsForm: false,
        }
    }

    onSwitchChange = (newCheckedValue) => {
        const { onSettingsChange } = this.props;
        onSettingsChange("isNodeImage", newCheckedValue)
    }

    toggleSettingsForm = () => {
        this.setState({showSettingsForm: !this.state.showSettingsForm})
    }

    render() {
        const { settings } = this.props;
        const { showSettingsForm } = this.state;

        return (
            <div>
                <Button onClick={this.toggleSettingsForm}>
                    {showSettingsForm ? "Hide Options": "Options"}
                </Button>
                {showSettingsForm &&
                    <div>
                        <br />
                        <p>Enable Node Images: </p><Switch checked={settings.isNodeImage} onChange={this.onSwitchChange}/>
                    </div>
                }
            </div>
        )
    }

}


export default ContactsNetworkGraphSettings

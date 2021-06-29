import React from 'react';
import FormDynamic from "../../components/Form/FormDynamic";
import { ALL_DEMOGRAPHICS } from "../../models/ConstantsForm";
import { DEFAULT_CONTACT } from '../../models/Contact';
import { Button } from "antd";
import ContactsAPI from "../../services/ContactsAPI";
import { FormUtils } from '../../services/FormUtils';

let contactFormConfigsPage1 = [
    {
        keyName: 'organization_name',
    },
    {
        keyName: 'instagram_username',
    },
    {
        keyName: 'profile_pic_url',
    },
]

for (const [demographicKey, demographicOptions] of Object.entries(ALL_DEMOGRAPHICS)) {
    const inputConfig = {
        keyName: demographicKey,
        type: 'autocomplete',
        suggestions: demographicOptions,
        skipPrettifyKeys: true,
    }
    contactFormConfigsPage1.push(inputConfig);
  }

class ContactAddEdit extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            contact: Object.assign({}, DEFAULT_CONTACT),
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { contact } = this.state;
        contact.source_url = window.location.href;


        ContactsAPI.create(contact)
    }

    updateForm = (event) => {
        const { contact } = this.state;

        const updateContact = FormUtils.updateModelUsingForm(contact, event);

        this.setState({contact: updateContact });
    }

    render() {
        const { contact } = this.state;
        return (
            <div>
                <FormDynamic model={contact}
                                         inputConfigs={contactFormConfigsPage1}
                                         onUpdateForm={this.updateForm}/>
                    <Button type="submit"
                                className="btn btn-primary col-12 mt-2"
                                onClick={this.handleSubmit}>Save</Button>
            </div>
        );

    }
}


export default ContactAddEdit;
import React from 'react';
import FormDynamic from "../../components/Form/FormDynamic";
import {MAJORS_LIST, SCHOOLS_LIST} from "../../models/ConstantsForm";
import { DEFAULT_CONTACT } from '../../models/Contact';
import { Button } from "antd";
import ContactsAPI from "../../services/ContactsAPI";

let contactFormConfigsPage1 = [
    {
        keyName: 'organization_name',
    },
    {
        keyName: 'instagram_username',
    },
    {
        keyName: 'eligible_programs',
        placeholder: 'Eligible Programs (leave blank for any) 📚',
        type: 'autocomplete',
        suggestions: MAJORS_LIST
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Eligible Schools (leave blank for any) 🏫',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST
    },
    {
        keyName: 'ethnicity',
    },
    {
        keyName: 'industries',
    },
    
]

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


        ContactsAPI.create(contact)
    }

    updateForm = (event) => {
        event.preventDefault();
        const { contact } = this.state;

        const newFormData = {
            ...contact,
            [event.target.name]: event.target.value
        };

        this.setState({contact: newFormData });
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
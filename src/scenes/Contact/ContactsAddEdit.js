import React from 'react';
import FormDynamic from "../../components/Form/FormDynamic";
import {MAJORS_LIST} from "../../models/ConstantsForm";
import { DEFAULT_CONTACT } from '../../models/Contact';


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
]

class ContactAddEdit extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            contact: Object.assign({}, DEFAULT_CONTACT),
        };
    }

    render() {
        const { contact } = this.state;

        return (
            <div>
                <FormDynamic model={contact}
                                         inputConfigs={contactFormConfigsPage1}/>
            </div>
        );

    }
}


export default ContactAddEdit;
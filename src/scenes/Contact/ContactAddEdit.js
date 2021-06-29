import React from 'react';
import PropTypes from "prop-types";
import FormDynamic from "../../components/Form/FormDynamic";
import { ALL_DEMOGRAPHICS } from "../../models/ConstantsForm";
import { DEFAULT_CONTACT } from '../../models/Contact';
import { Button, Tag } from "antd";
import ContactsAPI from "../../services/ContactsAPI";
import { FormUtils } from '../../services/FormUtils';
import {connect} from "react-redux";
import EditsAPI from '../../services/EditsApi';
import { prettifyKeys } from '../../services/utils';

const EDIT_MODES = ['add', 'edit', 'suggest'];
const EDIT_MODES_HELPER_TEXT = {
    suggest: 'Your changes will be saved as suggestions and added to this club if accepted'
}
let contactFormConfigsPage1 = [
    {
        keyName: 'organization_name',
    },
    {
        keyName: 'instagram_username',
    },
    // TODO only show if no profile_pic_url exists or it's an admin user
    // {
    //     keyName: 'profile_pic_url',
    // },
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
        
        let editMode = props.editMode;

        if(editMode === "edit" && !props.loggedInUserProfile?.is_atila_admin) {
            editMode = "suggest";
        }

        this.state = {
            contact: props.contact || Object.assign({}, DEFAULT_CONTACT),
            editMode,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { contact, editMode } = this.state;
        let contactsSubscription;
        switch (editMode) {
            case "add":
                contactsSubscription = ContactsAPI.create(contact);
                break;
            case "suggest":
                contactsSubscription = EditsAPI.suggestEdit("contact", contact.id, contact);
                break;
            case "edit":
                contactsSubscription = ContactsAPI.update(contact, contact.id);
                break;
            default:
                console.log(`received unexpected editmode: ${editMode}. Expected one of ${EDIT_MODES}`)
                return;
        }

        contactsSubscription
        .then(res => {
            console.log({res});
        })
        .catch(err=> {
            console.log({err});
        })
        
    }

    updateForm = (event) => {
        const { contact } = this.state;

        const updateContact = FormUtils.updateModelUsingForm(contact, event);

        this.setState({contact: updateContact });
    }

    render() {
        const { contact, editMode } = this.state;

        let editModeTag = <Tag color="blue">{prettifyKeys(editMode)} Mode</Tag>;

        if (EDIT_MODES_HELPER_TEXT[editMode]) {
            editModeTag = <>
                {editModeTag}
                <small className="text-muted"><br/>
                {EDIT_MODES_HELPER_TEXT[editMode]}
                </small>
            </>
        }
        return (
            <div>
                {editModeTag}
                <FormDynamic model={contact}
                                         inputConfigs={contactFormConfigsPage1}
                                         onUpdateForm={this.updateForm}/>
                    <Button type="submit"
                                className="btn btn-primary col-12 mt-2"
                                onClick={this.handleSubmit}>Save</Button>
            </div>
        );

    }
};

ContactAddEdit.defaultProps = {
    editMode: 'add',
};

ContactAddEdit.propTypes = {
    editMode: PropTypes.oneOf(EDIT_MODES).isRequired,
    contact: PropTypes.shape({}),
};

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ContactAddEdit);
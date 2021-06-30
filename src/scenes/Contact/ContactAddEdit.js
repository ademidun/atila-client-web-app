import React from 'react';
import PropTypes from "prop-types";
import FormDynamic from "../../components/Form/FormDynamic";
import { ALL_DEMOGRAPHICS } from "../../models/ConstantsForm";
import { CONTACT_TYPES, DEFAULT_CONTACT } from '../../models/Contact';
import { Button, Tag } from "antd";
import ContactsAPI from "../../services/ContactsAPI";
import { FormUtils } from '../../services/FormUtils';
import {connect} from "react-redux";
import EditsAPI from '../../services/EditsApi';
import { prettifyKeys } from '../../services/utils';
import {toastNotify} from "../../models/Utils";
import Loading from "../../components/Loading";

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
    {
        keyName: 'account_type',
        type: 'select',
        options: CONTACT_TYPES,
        renderOption: (option) => prettifyKeys(option)
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
            loading: null,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: "Submitting..."})

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

        const placeBottomOption = {
            position: "bottom-left",
        }

        contactsSubscription
        .then(res => {
            toastNotify(`${editMode} request was successful!`, "success", placeBottomOption)
        })
        .catch(err=> {
            console.log({err});
            const errorMessage = `Error submitting ${editMode} request.
                          Please message us using the chat in the bottom right corner.`
            toastNotify(errorMessage, "error", placeBottomOption)
        })
        .finally(()=>{
                this.setState({loading: null})
        })
        
    }

    updateForm = (event) => {
        const { contact } = this.state;

        const updateContact = FormUtils.updateModelUsingForm(contact, event);

        this.setState({contact: updateContact });
    }

    render() {
        const { contact, editMode, loading } = this.state;

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
                {loading && <Loading title={loading} />}
                <Button type="submit"
                        className="btn btn-primary col-12 mt-2"
                        onClick={this.handleSubmit}
                        disabled={loading}>Save</Button>
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
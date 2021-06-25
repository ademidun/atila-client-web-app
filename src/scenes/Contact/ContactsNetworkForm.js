import React from 'react';


class ContactsNetworkForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            contacts: props.contacts,
        };
    }

    render() {

        return (
            <div>
                ContactsNetworkForm
            </div>
        );
    }
}

export default ContactsNetworkForm;
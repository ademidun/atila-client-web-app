import React from 'react';


class ContactsNetworkGraph extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            contacts: props.contacts,
        };
    }

    render() {

        return (
            <div>
                ContactsNetworkGraph
            </div>
        );
    }
}

export default ContactsNetworkGraph;
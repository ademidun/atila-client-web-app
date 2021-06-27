import React from 'react';
import { MASTER_LIST_EVERYTHING_UNDERSCORE } from '../../models/ConstantsForm';
import AutoComplete from '../../components/AutoComplete';


class ContactsNetworkForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            handleChange: '',
            contacts: []
        };

    }

    handleChange = (event) => {
        const { name, value } = event.target;
        console.log({ name, value });

        this.setState({
            searchQuery: value
        })

    }


    render() {
        const { searchQuery } = this.state;

        return (
            <div style={{"height": "250px"}}>
                <AutoComplete   suggestions={MASTER_LIST_EVERYTHING_UNDERSCORE}
                                placeholder={"Search by school, city, program, ethnicity or more"}
                                onSelected={this.handleChange}
                                value={searchQuery}
                                keyName={'searchString'}/>
            </div>
        );
    }
}

export default ContactsNetworkForm;
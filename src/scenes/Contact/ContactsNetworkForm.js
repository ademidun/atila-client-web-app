import React from 'react';


class ContactsNetworkForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            value: '',
            contacts: []
        };

    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
             [name]: value
        })

    }


    render() {
        return (
            <div>
                <form style={{padding: "30px"}}>
                    <label>
                        Contacts:
                        <input 
                            type="text" 
                            value={this.state.value} 
                            name="value" 
                            onChange={this.handleChange}/>
                    </label><br/>
                </form>
            </div>
        );
    }
}

export default ContactsNetworkForm;
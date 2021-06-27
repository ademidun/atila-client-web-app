import React from 'react';
import ContactAddEdit from '../scenes/Contact/ContactsAddEdit';

class Admin extends React.Component {

    constructor(props){
        super()
        this.state = {}

    }
   
    render(){
        
        return (
            <div>
                <h1 style={{padding:"10px"}}>Admin Dashboard</h1> 
                <ContactAddEdit />    
            </div>
            
        )
    }
}

export default Admin
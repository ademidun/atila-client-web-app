import React from 'react';
import ContactAPI from "../services/ContactAPI";

class Admin extends React.Component {

    constructor(props){
        super()
        this.state = {
            contact: {},
            first_name: '',
            last_name: '',
            email: '',
            instagram_username: '',
            organization_name: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
             [name]: value
        })
    }

    saveAsContact = (event) => {
        event.preventDefault()
        
        const { first_name, last_name, email, instagram_username, organization_name } = this.state;

        const createdContact = {
            first_name,
            last_name,
            email,
            instagram_username,
            organization_name
        }

        console.log(createdContact)

        ContactAPI.create(createdContact)
    }
   
    render(){
        
        return (
            <div>
                <h1 style={{padding:"10px"}}>Admin Dashboard</h1> 
                <form style={{padding: "30px"}} onSubmit={this.saveAsContact}>
                    <label>
                        First Name:
                        <input 
                            type="text" 
                            value={this.state.first_name} 
                            name="first_name" 
                            onChange={this.handleChange}/>
                    </label><br/>
                    <label>
                        Last Name:
                        <input 
                            type="text" 
                            value={this.state.last_name} 
                            name="last_name" 
                            onChange={this.handleChange}/>
                    </label><br/>
                    <label>
                        Organization Name:
                        <input 
                            type="text" 
                            value={this.state.organization_name} 
                            name="organization_name"
                            onChange={this.handleChange} />
                    </label><br/>
                    <label>
                        Email:
                        <input 
                            type="text" 
                            value={this.state.email} 
                            name="email"
                            onChange={this.handleChange} />
                    </label><br/>
                    <label>
                        Instagram Username:
                        <input 
                            type="text" 
                            value={this.state.instagram_username} 
                            name="instagram_username"
                            onChange={this.handleChange} />
                    </label><br/>
                    
                    <input type="submit" value="Submit" />
                </form>
            </div>
            
        )
    }
}

export default Admin
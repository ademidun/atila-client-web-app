import React from 'react';

class Admin extends React.Component {

    constructor(props){
        super()
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            instagramUsername: '',
            organizationName: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
             [name]: value
        })
    }

    save_as_contact(){

        const createdContact = this.state
            
    }
   
    render(){
        
        return (
            <div>
                <h1 style={{padding:"10px"}}>Admin Dashboard</h1> 
                <form style={{padding: "30px"}} onSubmit={this.save_as_contact}>
                    <label>
                        First Name:
                        <input 
                            type="text" 
                            value={this.state.firstName} 
                            name="firstName" 
                            onChange={this.handleChange}/>
                    </label><br/>
                    <label>
                        Last Name:
                        <input 
                            type="text" 
                            value={this.state.lastName} 
                            name="lastName" 
                            onChange={this.handleChange}/>
                    </label><br/>
                    <label>
                        Organization Name:
                        <input 
                            type="text" 
                            value={this.state.organizationName} 
                            name="organizationName"
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
                            value={this.state.instagramUsername} 
                            name="instagramUsername"
                            onChange={this.handleChange} />
                    </label><br/>
                    
                    <input type="submit" value="Submit" />
                </form>
            </div>
            
        )
    }
}

export default Admin
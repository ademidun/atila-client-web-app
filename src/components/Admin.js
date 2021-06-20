import React from 'react';

class Admin extends React.Component {

    constructor(props){
        super()
        this.state = {
            contacts: {}
        }
    }

    save_as_contact(){

        console.log("button is clicked")
    }
   
    render(){
        
        return (
            <div>
                <h1 style={{padding:"10px"}}>Admin Dashboard</h1> 
                <form style={{padding: "30px"}} onSubmit={this.save_as_contact}>
                    <label>
                        First Name:
                        <input type="text" name="name" />
                    </label><br/>
                    <label>
                        Last Name:
                        <input type="text" name="name" />
                    </label><br/>
                    <label>
                        Organization Name:
                        <input type="text" name="name" />
                    </label><br/>
                    <label>
                        Email:
                        <input type="text" name="name" />
                    </label><br/>
                    <label>
                        Instagram Username:
                        <input type="text" name="name" />
                    </label><br/>
                    
                    <input type="submit" value="Submit" />
                </form>
            </div>
            
        )
    }
}

export default Admin
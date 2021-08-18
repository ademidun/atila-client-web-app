import React from "react";

class NotionPageOnAtila extends React.Component {

    render(){
    
        const DEFAULT_PAGE_ID = 'default page id'
        const urlPath = window.location.pathname.substring(3)
        
        return(
            <div className="container mt-5">    
                <p>{DEFAULT_PAGE_ID}</p>
                <p>{urlPath}</p>
            </div>
        )  
    }
}

export default NotionPageOnAtila
import React from "react";
import { NotionRenderer } from "react-notion";
import NotionService from "../../services/NotionService";


class NotionPageOnAtila extends React.Component {


    constructor(props) {
        super(props);

        const { pageId } = this.props.match.params;

        this.state = {
            pageId,
            pageData: {},
        }
    }

    componentDidMount() {
        const { pageId } = this.state;
        NotionService.getPageId(pageId)
        .then(res => {
            console.log({res});
            this.setState({pageData: res});
        })
        .catch( err => {
            console.log({err});
        })
    }

    render(){
        const { pageData, pageId } = this.state;
        
        return(
            <div className="container mt-5">    
                <p>{pageId}</p>
                <NotionRenderer blockMap={pageData} />
            </div>
        )  
    }
}

export default NotionPageOnAtila
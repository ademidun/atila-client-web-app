import React from "react";
import { NotionRenderer } from "react-notion";
import Loading from "../../components/Loading";
import NotionService from "../../services/NotionService";
import { createTableOfContents } from "../../services/utils";


class NotionPage extends React.Component {


    constructor(props) {
        super(props);

        const { pageId } = this.props.match.params;

        this.state = {
            pageId,
            pageData: {},
            loading: null,
        }
    }

    componentDidMount() {
        const { pageId } = this.state;
        this.setState({loading: "Loading page information"});
        NotionService.getPageId(pageId)
        .then(res => {
            this.setState({pageData: res.data}, () => {
                createTableOfContents(".NotionPage-content");
            });
        })
        .catch( err => {
            console.log({err});
        })
        .then(()=> {
            this.setState({loading: null});
        })
    }

    render(){
        const { pageData, loading } = this.state;

        return(
            <div className="NotionPage container">
                <div className="NotionPage-content">
                    <Loading isLoading={loading} title={loading} />
                    <NotionRenderer blockMap={pageData} />
                </div>
            </div>
        )  
    }
}

export default NotionPage 
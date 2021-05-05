import React from "react";
import UtilsAPI from "../services/UtilsAPI";
import { NotionRenderer} from "react-notion";
import {createTableOfContents, scrollToElement} from "../services/utils";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import Loading from "./Loading";

export class NotionEmbed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingMessage: props.loadingMessage,
            pageID: props.pageID,
            loading: false,
            notionPageData: null,
        }
    }


    componentDidMount() {

        this.loadNotionPage();
    }


    loadNotionPage() {

        const { location } = this.props;

        this.setState({loading: this.state.loadingMessage});    // set loading message to an input by the constructor

        UtilsAPI.loadNotionContent(this.state.pageID)
        .then(res=> {

            this.setState({notionPageData: res.data});

            if (location && location.hash) {
                createTableOfContents(".embedded-place");
                // Pause for 300 milliseconds before scrolling to the hash element, without this setTimeout
                // the element kept scrolling back to the top of the page.
                setTimeout(() => {
                    scrollToElement(location.hash);
                }, 300);
            }
        })

        .catch(err => {
            console.log({err})
        })
        .finally( () => {
            this.setState({loading: false});
        })
    }

    //<BackTop/>, classname and seoContent can be added in the parent to which this class is called
    render() {
        const { loading, notionPagedata } = this.state;

        return(
            <div>
                {loading && <Loading title={loading} /> }
                <div className="container mt-5">
                    <div className="card shadow p-3 embedded-place">
                        {notionPagedata &&
                        <div style={{ maxWidth: 768 }}>
                            <NotionRenderer blockMap={notionPagedata} />
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
import React, {Component} from "react";
/* eslint-disable no-unused-vars */
// The tableau library needs to be imported even though it will be used
// via window.tableau.Viz and not tableau.Viz
// noinspection ES6UnusedImports
import tableau from "tableau-api";
import Loading from "./Loading";
/* eslint-enable no-unused-vars */
export default class TableauViz extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoadedViz: false
        }
    }

    createViz(url) {
        const noShareUrl = `${url}&:showShareOptions=false`;
        const vizContainer = this.vizContainer;

        const options = {
            onFirstInteractive: () => {
                this.setState({isLoadedViz: true})
            },
        };
        this.viz = new window.tableau.Viz(vizContainer, noShareUrl, options);
    }

    componentDidMount() {
        const { url } = this.props;

        if (this.viz && this.viz.dispose) {
            this.viz.dispose();
        }
        this.createViz(url);
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        const { url } = this.props;
        const { url: prevUrl } = prevProps;

        if (url === prevUrl) {
            return
        }

        if (this.viz && this.viz.dispose) {
            this.viz.dispose();
        }
        this.createViz(url);

    }

    render() {
        return (
            <div className="text-center container">
                {!this.vizContainer && <Loading title="Loading visualization..." />}
                <div
                    ref={(div) => {
                        this.vizContainer = div;
                    }}
                />
            </div>
        );
    }

}

import React, {Component} from "react";
/* eslint-disable no-unused-vars */
// The tableau library needs to be imported even though it will be used
// via window.tableau.Viz and not tableau.Viz
// noinspection ES6UnusedImports
import tableau from "tableau-api";
/* eslint-enable no-unused-vars */
export default class TableauViz extends Component {

    createViz(url) {

        const vizContainer = this.vizContainer;
        this.viz = new window.tableau.Viz(vizContainer, url);
    }

    componentDidMount() {
        const { url } = this.props;

        console.log('componentDidMount', url);
        if (this.viz && this.viz.dispose) {
            this.viz.dispose();
        }
        this.createViz(url);
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        const { url } = this.props;
        const { url: prevUrl } = prevProps;
        console.log({ url, prevProps, prevState, snapShot });
        console.log('this.props', this.props);
        console.log('componentDidUpdate', { url, prevUrl });

        if (url === prevUrl) {
            console.log('no url change');
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
                <div
                    ref={(div) => {
                        this.vizContainer = div;
                    }}
                />
            </div>
        );
    }

}

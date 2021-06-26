import React from 'react';
import { graph } from "./ContactsNetworkGraphCreate";

class ContactsNetworkGraph extends React.Component {

    constructor(props){
        super(props);

        this.graphRef = React.createRef();
    }

    componentDidMount() {
        this.drawGraph()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.drawGraph()
    }

    clearGraph = () => {
        while (this.graphRef.current.firstChild) {
            this.graphRef.current.removeChild(this.graphRef.current.firstChild)
        }
    }

    drawGraph = () => {
        this.clearGraph()
        const { contacts } = this.props;
        if (contacts?.length > 0) {
            this.graphRef.current.appendChild(graph(contacts))
        }
    }

    render() {
        return (
            <div>
                ContactsNetworkGraph
                <div ref={this.graphRef} />
            </div>
        );
    }
}

export default ContactsNetworkGraph;
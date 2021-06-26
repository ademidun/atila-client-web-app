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

    drawGraph = () => {
        const { contacts } = this.props;

        this.graphRef.current.appendChild(graph(contacts))
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
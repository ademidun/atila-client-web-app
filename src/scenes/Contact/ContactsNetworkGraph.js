import React from 'react';
import { graph } from "./ContactsNetworkGraphCreate";

class ContactsNetworkGraph extends React.Component {

    constructor(props){
        super(props);

        this.graphRef = React.createRef();

        this.state = {
            currentGraph: null,
        }
    }

    componentDidMount() {
        if (this.props.contacts?.length > 0) {
            this.drawGraph()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.contacts.length !== prevProps.contacts.length) {
            this.drawGraph()
        }
    }

    drawGraph = () => {
        const { contacts } = this.props;
        if (contacts.length > 0) {
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
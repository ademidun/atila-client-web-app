import React from 'react';
import { Modal } from "antd";
import { graph } from "./ContactsNetworkGraphCreate";

class ContactsNetworkGraph extends React.Component {

    constructor(props){
        super(props);

        this.graphRef = React.createRef();
        this.state = {
            isNodeModalVisible: false,
            selectedNode: null,
        }
    }

    componentDidMount() {
        this.drawGraph()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Only redraw graph when props change,
        // Consider using something like fast-deep-equal (https://www.npmjs.com/package/fast-deep-equal) to compare arrays
        // instead of naively checking array length
        if (prevProps.contacts.length !== this.props.contacts.length) {
            this.drawGraph()
        }
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
            this.graphRef.current.appendChild(graph(contacts, this.onNodeClick))
        }
    }

    onNodeClick = (node) => {
        this.setState({isNodeModalVisible: true, selectedNode: node})
    }

    closeModal = () => {
        this.setState({isNodeModalVisible: false, selectedNode: null})
    }

    render() {
        const { isNodeModalVisible, selectedNode } = this.state;

        let nodeModalTitle = null;
        if (isNodeModalVisible) {
            console.log(selectedNode)
            nodeModalTitle = (
                <div>
                    <img src={selectedNode.profile_pic_url}
                         className="rounded-circle m-1"
                         alt={selectedNode.id}
                         style={{width: "30px", height: "30px"}} />
                    {selectedNode.id}
                </div>
            )
        }

        return (
            <div>
                ContactsNetworkGraph
                <div ref={this.graphRef} />
                <Modal
                    visible={isNodeModalVisible}
                    title={nodeModalTitle}
                    footer={null}
                    onCancel={this.closeModal}
                >
                    <p>Follower count: {selectedNode?.followers_count}</p>
                    <p>Following count: {selectedNode?.following_count}</p>
                </Modal>
            </div>
        );
    }
}

export default ContactsNetworkGraph;
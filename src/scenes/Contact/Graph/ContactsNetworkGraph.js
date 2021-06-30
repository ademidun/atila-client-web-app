import React from 'react';
import { Button, Modal } from "antd";
import { graph } from "./ContactsNetworkGraphCreate";
import ContactAddEdit from '../ContactAddEdit';
import equal from "fast-deep-equal"
import ContactsNetworkGraphSettings from "./ContactsNetworkGraphSettings";

const DEFAULT_GRAPH_SETTINGS = {
    isNodeImage: true,
    showArrows: true,
}

class ContactsNetworkGraph extends React.Component {

    constructor(props){
        super(props);

        this.graphRef = React.createRef();
        this.state = {
            isNodeModalVisible: false,
            selectedNode: null,
            isEditNodeFormVisible: true,
            graphSettings: Object.assign({}, DEFAULT_GRAPH_SETTINGS),
        }
    }

    componentDidMount() {
        this.drawGraph()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Only redraw graph when props change,
        if ((!equal(prevProps.contacts, this.props.contacts)) ||
            (!equal(prevState.graphSettings, this.state.graphSettings))) {
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
        const { graphSettings } = this.state;
        if (contacts?.length > 0) {
            this.graphRef.current.appendChild(graph(contacts, graphSettings, this.onNodeClick))
        }
    }

    onNodeClick = (node) => {
        this.setState({isNodeModalVisible: true, selectedNode: node})
    }

    toggleEditNode = () => {
        this.setState({isEditNodeFormVisible: !this.state.isEditNodeFormVisible})
    }

    closeModal = () => {
        this.setState({isNodeModalVisible: false, selectedNode: null})
    }


    onGraphSettingsChange = (key, value) => {
        let newGraphSettings = {...this.state.graphSettings}
        newGraphSettings[key] = value

        this.setState({graphSettings: newGraphSettings})
    }

    render() {
        const { isNodeModalVisible, selectedNode, isEditNodeFormVisible, graphSettings } = this.state;

        let nodeModalTitle = null;
        if (isNodeModalVisible) {
            nodeModalTitle = (
                <div>
                    <img src={selectedNode.data.profile_pic_url}
                         className="rounded-circle m-1"
                         alt={selectedNode.data.organization_name}
                         style={{width: "50px", height: "50px"}} />
                    <h2>
                    {selectedNode.data.organization_name}
                    </h2><br/>
                    <a  target="_blank" rel="noopener noreferrer" href={`https://instagram.com/${selectedNode.data.instagram_username}/`}>
                      View Instagram
                    </a>
                </div>
            )
        }

        return (
            <div className="p-3">
                <p>
                    Hint: Try dragging the club pictures around!
                </p>

                <ContactsNetworkGraphSettings onSettingsChange={this.onGraphSettingsChange} settings={graphSettings} />
                <br />
                <div style={{"border": "1px solid #40a9ff"}}>
                    <div ref={this.graphRef} />
                    {selectedNode && 
                        <Modal
                            visible={isNodeModalVisible}
                            title={nodeModalTitle}
                            footer={null}
                            onCancel={this.closeModal}
                        >
                            <p>About this club: <br/> {selectedNode?.data.instagram_bio}</p>
                            <p>Follower count: {selectedNode?.data.instagram_followers_count.toLocaleString()}</p>
                            <p>Following count: {selectedNode?.data.instagram_following_count.toLocaleString()}</p>
                            <p>Incorrect or Missing Information? You can suggest an edit. <br/>
                                <Button onClick={this.toggleEditNode} type="link">
                                {isEditNodeFormVisible ? "Hide ": ""}Suggest Edit
                                </Button>
                            </p>
                            {isEditNodeFormVisible && <ContactAddEdit contact={selectedNode?.data} editMode="edit" />}
                        </Modal>
                    }
                </div>
            </div>
        );
    }
}

export default ContactsNetworkGraph;
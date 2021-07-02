import React from 'react';
import { Button, Modal } from "antd";
import { graph } from "./ContactsNetworkGraphCreate";
import ContactAddEdit from '../ContactAddEdit';
import equal from "fast-deep-equal"

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
        const { isNodeModalVisible, selectedNode, isEditNodeFormVisible } = this.state;


        let nodeModalTitle = null;
        let selectedContact = null;
        if (selectedNode && selectedNode.data) {
            selectedContact = selectedNode.data;
        }

        if (isNodeModalVisible && selectedContact) {
            nodeModalTitle = (
                <div>
                    <img src={selectedContact.profile_pic_url}
                         className="rounded-circle m-1"
                         alt={selectedContact.organization_name}
                         style={{width: "50px", height: "50px"}} />
                    <h2>
                    {selectedContact.organization_name}
                    </h2><br/>
                    <a  target="_blank" rel="noopener noreferrer" href={`https://instagram.com/${selectedContact.instagram_username}/`}>
                      View Instagram (@{selectedContact.instagram_username})
                    </a>
                </div>
            )
        }

        return (
            <div className="p-3">
                <div>
                    Hint:<br/>
                    <ol>
                        <li>Hover to see the club name</li>
                        <li>Click to see club details</li>
                        <li>Try dragging the club pictures around!</li>
                    </ol>
                </div>

                {/*<ContactsNetworkGraphSettings onSettingsChange={this.onGraphSettingsChange} settings={graphSettings} />*/}
                <br />
                <div style={{"border": "1px solid #40a9ff"}}>
                    <div ref={this.graphRef} />
                    {selectedContact && 
                        <Modal
                            visible={isNodeModalVisible}
                            title={nodeModalTitle}
                            footer={null}
                            onCancel={this.closeModal}
                        >
                            <p>About this club: 
                                <br/> {selectedContact.instagram_bio} 
                                <br/> <a  target="_blank" rel="noopener noreferrer" href={selectedContact.instagram_external_url}>
                                        {selectedContact.instagram_external_url} </a>
                            </p>
                            <p>Follower count: {selectedContact.instagram_followers_count?.toLocaleString()}</p>
                            <p>Following count: {selectedContact.instagram_following_count?.toLocaleString()}</p>
                            <p>Incorrect or Missing Information? You can suggest an edit. <br/>
                                <Button onClick={this.toggleEditNode} type="link">
                                {isEditNodeFormVisible ? "Hide ": ""}Suggest Edit
                                </Button>
                            </p>
                            {isEditNodeFormVisible && <ContactAddEdit contact={selectedContact} editMode="edit" />}
                        </Modal>
                    }
                </div>
            </div>
        );
    }
}

export default ContactsNetworkGraph;
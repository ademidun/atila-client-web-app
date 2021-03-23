import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import { Button, Drawer } from "antd";

class ApplicationViewPreviousApplications extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            applications: null,
            isDrawerVisible: false,
            isChildDrawerVisible: false,
        };
    }

    componentDidMount() {
        this.getPreviousApplications()
    }

    getPreviousApplications() {
        const {user : userId}  = this.props.userProfile;

        this.setState({loading: "Loading previous applications"});
        UserProfileAPI.getUserContent(userId, 'applications')
            .then(res => {
                const applications =  res.data.applications;
                this.setState({applications});
            })
            .finally(() => {
                this.setState({loading: null});
            });
    }

    showDrawer = () => {
        this.setState({isDrawerVisible: true})
    };
    onDrawerClose = () => {
        this.setState({isDrawerVisible: false})
    };

    showChildDrawer = () => {
        this.setState({isChildDrawerVisible: true})
    };
    onChildDrawerClose = () => {
        this.setState({isChildDrawerVisible: false})
    };

    render() {
        const { isDrawerVisible, isChildDrawerVisible } = this.state;

        return (
            <div>
                <Button type="primary" onClick={this.showDrawer}>
                    View Previous Applications
                </Button>

                <Drawer
                    title="Previous Applications"
                    width={520}
                    closable={false}
                    onClose={this.onDrawerClose}
                    visible={isDrawerVisible}
                >
                    <Button type="primary" onClick={this.showChildDrawer}>
                        Two-level drawer
                    </Button>
                    <Drawer
                        title="Responses"
                        width={320}
                        closable={true}
                        onClose={this.onChildDrawerClose}
                        visible={isChildDrawerVisible}
                    >
                        This is two-level drawer
                    </Drawer>
                </Drawer>
            </div>
        )
    }

}

export default ApplicationViewPreviousApplications

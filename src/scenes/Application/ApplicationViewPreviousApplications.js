import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import { Button, Drawer } from "antd";
import Loading from "../../components/Loading";

class ApplicationViewPreviousApplications extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            applications: null,
            isDrawerVisible: false,
            isChildDrawerVisible: false,
            currentApplication: null,
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

    showChildDrawer = (application) => {
        this.setState({isChildDrawerVisible: true, currentApplication: application})
    };
    onChildDrawerClose = () => {
        this.setState({isChildDrawerVisible: false})
    };

    viewCurrentApplicationResponses = () => {
        const { currentApplication }  = this.state;

        if (!currentApplication) {
            return null
        }

        let responses = currentApplication.scholarship_responses;

        return Object.keys(responses).map(key => (
            <>
                <b>{responses[key].question}</b>
                <br />
                {responses[key].type === "long_answer" ?
                    <div className="my-1" dangerouslySetInnerHTML={{__html: responses[key].response}}/>
                    : responses[key].type === "checkbox" ?
                        responses[key].response ? "Yes" : "No"
                        : responses[key].response}
                <br />
                <br />
            </>
        ))
    }

    render() {
        const { applications, loading, isDrawerVisible, isChildDrawerVisible } = this.state;

        let drawerContent;

        if (loading || !applications) {
            drawerContent = (
                <Loading title={loading} />
            )

        } else if (applications.length === 0) {
            drawerContent = (
                <h3>You have no previous applications</h3>
            )

        } else {
            drawerContent = applications.map(application => (
                <>
                    <h4>{application.scholarship.name}</h4>
                    <Button type="primary" onClick={() => {
                        this.showChildDrawer(application)
                    }}>
                        View application
                    </Button>
                    <br/>
                    <br/>
                </>
            ))
        }

        return (
            <div>
                <Button type="primary" onClick={this.showDrawer}>
                    View Previous Applications
                </Button>

                <Drawer
                    title={<h2>Previous Applications</h2>}
                    width={520}
                    closable={false}
                    onClose={this.onDrawerClose}
                    visible={isDrawerVisible}
                >
                    {drawerContent}
                    <Drawer
                        title={<b>Responses</b>}
                        width={400}
                        closable={true}
                        onClose={this.onChildDrawerClose}
                        visible={isChildDrawerVisible}
                    >
                        {this.viewCurrentApplicationResponses()}
                    </Drawer>
                </Drawer>
            </div>
        )
    }

}

export default ApplicationViewPreviousApplications

import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import { Button, Drawer, message } from "antd";
import Loading from "../../components/Loading";

class ApplicationViewPreviousApplications extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            applications: null,
            isDrawerVisible: false,
            isChildDrawerVisible: false,
            openApplication: null,
        };
    }

    componentDidMount() {
        this.getPreviousApplications()
    }

    getPreviousApplications() {
        const {user : userId}  = this.props.userProfile;
        const { currentApplicationID } = this.props;

        this.setState({loading: "Loading previous applications"});
        UserProfileAPI.getUserContent(userId, 'applications')
            .then(res => {
                let applications =  res.data.applications;
                if (currentApplicationID) {
                    function excludeDuplicate(application) {
                        return application.id !== currentApplicationID
                    }
                    applications = applications.filter(excludeDuplicate)
                }
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
        this.setState({isChildDrawerVisible: true, openApplication: application})
    };
    onChildDrawerClose = () => {
        this.setState({isChildDrawerVisible: false})
    };

    copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        message.success("Copied!")
    }

    viewOpenApplicationResponses = () => {
        const { openApplication }  = this.state;

        if (!openApplication) {
            return null
        }

        let responses = openApplication.scholarship_responses;

        return Object.keys(responses).map(key => {
            const question = responses[key].question;
            const type = responses[key].type;
            const response = responses[key].response;

            return (
                <>
                    <b>{question}</b>
                    <br/>
                    {type === "long_answer" ?
                        <div className="my-1" dangerouslySetInnerHTML={{__html: response}}/>
                        : type === "checkbox" ?
                            response ? "Yes" : "No"
                            : response}
                    <br/>
                    {type.includes("answer") &&
                    <Button onClick={() => {
                        this.copyToClipboard(response)
                    }}>Copy To Clipboard</Button>}
                    <br/>
                    <br/>
                </>
            )
        })
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
                        {this.viewOpenApplicationResponses()}
                    </Drawer>
                </Drawer>
            </div>
        )
    }

}

export default ApplicationViewPreviousApplications

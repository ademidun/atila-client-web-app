import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import { Button, Drawer, message, Collapse } from "antd";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {UserProfilePropType} from "../../models/UserProfile";

const { Panel } = Collapse;

class ApplicationViewPreviousApplications extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            applications: null,
            isDrawerVisible: false,
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

    render() {
        const { applications, loading, isDrawerVisible } = this.state;

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
            let collapseContent = applications.map((application, index) => (
                <Panel header={<h6>{application.scholarship.name}</h6>} key={index}>
                    <Link to={`/scholarship/${application.scholarship.slug}`}>View Scholarship</Link> <br />
                    <Link to={`/application/${application.id}`}>View Application</Link> <br />
                    <hr/>
                    <ViewApplicationResponses application={application} />
                </Panel>
            ))
            drawerContent = (
                <Collapse>
                    {collapseContent}
                </Collapse>
            )
        }

        return (
            <div>
                <Button type="primary" onClick={this.showDrawer}>
                    View Previous Applications
                </Button>

                <Drawer
                    title={<h2>Previous Applications</h2>}
                    width={Math.min(520, window.innerWidth)}
                    closable={true}
                    onClose={this.onDrawerClose}
                    visible={isDrawerVisible}
                >
                    {drawerContent}
                </Drawer>
            </div>
        )
    }
}

function ViewApplicationResponses ({application}) {
    let responses = application.scholarship_responses;

    return Object.keys(responses).map(key => {
        const question = responses[key].question;
        const type = responses[key].type;
        const response = responses[key].response;

        return (
            <div key={key}>
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
                    copyToClipboard(response)
                }}>Copy To Clipboard</Button>}
                <br/>
                <br/>
            </div>
        )
    })
}

// see https://stackoverflow.com/a/25275151/14874841
// Copy HTML as text (without HTML tags)
function copyToClipboard(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    let text = doc.body.textContent;
    return executeCopy(text);
}

// Copy text as text
function executeCopy(text) {
    navigator.clipboard.writeText(text)
    message.success("Copied!")
}

ApplicationViewPreviousApplications.propTypes = {
    currentApplicationID: PropTypes.string,
    userProfile: UserProfilePropType.isRequired,
}

export default ApplicationViewPreviousApplications

import React from "react";
import UserProfileAPI from "../../services/UserProfileAPI";
import { Button, Drawer, Collapse } from "antd";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {UserProfilePropType} from "../../models/UserProfile";
import { copyToClipboard } from '../../services/utils';

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
        const { applications } = this.props;

        if (applications) {
            this.setState({applications});
        } else {
            const {currentApplicationID, user : userId}  = this.props.userProfile;
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
    }

    showDrawer = () => {
        this.setState({isDrawerVisible: true})
    };

    onDrawerClose = () => {
        this.setState({isDrawerVisible: false})
    };

    render() {
        const { applications, loading, isDrawerVisible } = this.state;

        const drawerWidth = 520;
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
                    width={Math.min(drawerWidth, window.innerWidth)}
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

    return Object.keys(responses).map(key => (
            <div key={key}>
                <ViewQuestion questionDict={responses[key]} />
            </div>
    ))
}

// Component to view a question with the read more option
class ViewQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            readMore: false,
        };
    }

    onReadMoreClick = () => {
        this.setState({readMore: true});
    }

    render() {
        const { readMore } = this.state;
        const { questionDict } = this.props;

        const question = questionDict.question;
        const type = questionDict.type;
        const response = questionDict.response;

        const previewResponseLength = 300;
        const readMoreText = <Button type={"link"} onClick={this.onReadMoreClick}>...Read More</Button>

        const copyToClipBoardButton = (
            <Button onClick={() => {
                copyToClipboard(response)
            }}>Copy To Clipboard</Button>
        )

        let viewResponse;

        switch (type) {
            case "long_answer":
                if (response.length > previewResponseLength && !readMore) {
                    const previewText = response.substring(0, previewResponseLength);
                    viewResponse = (<>
                            <div className="my-1" dangerouslySetInnerHTML={{__html: previewText}}/>
                            {readMoreText}
                        </>);
                } else {
                    viewResponse = <div className="my-1" dangerouslySetInnerHTML={{__html: response}}/>
                }
                break;

            case "checkbox":
                if (response) {
                    viewResponse = "Yes";
                } else {
                    viewResponse = "No";
                }
                break;

            default:
                if (response.length > previewResponseLength && !readMore) {
                    const previewText = response.substring(0, previewResponseLength);
                    viewResponse = <>{previewText}{readMoreText}</>
                } else {
                    viewResponse = response;
                }
                break;
        }

        return (
            <>
                <b>{question}</b>
                <br/>
                {viewResponse}
                <br/>
                {type.includes("answer") && copyToClipBoardButton}
                <br/>
                <br/>
            </>
        )
    }
}

ApplicationViewPreviousApplications.propTypes = {
    currentApplicationID: PropTypes.string,
    applications: PropTypes.array, // If previous applications have already been fetched you can pass them in as a prop.
    userProfile: UserProfilePropType, // Required if fetching previous applications.
}

export default ApplicationViewPreviousApplications

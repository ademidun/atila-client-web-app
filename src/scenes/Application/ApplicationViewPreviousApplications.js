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
        const { applications, loading, isDrawerVisible, isChildDrawerVisible } = this.state;

        let scholarshipTitles = applications?.map(application => (
                <>
                    <h4>{application.scholarship.name}</h4>
                    <Button type="primary" onClick={this.showChildDrawer}>
                        View application
                    </Button>
                    <br />
                    <br />
                </>
            ))

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
                    {loading && <Loading title={loading} />}
                    {!loading &&
                    <>
                        {scholarshipTitles}
                        <Drawer
                            title={<b>Responses</b>}
                            width={320}
                            closable={true}
                            onClose={this.onChildDrawerClose}
                            visible={isChildDrawerVisible}
                        >
                            Responses here
                        </Drawer>
                    </>
                    }

                </Drawer>
            </div>
        )
    }

}

export default ApplicationViewPreviousApplications

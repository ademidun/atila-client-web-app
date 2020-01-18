import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import FormDynamic from "../../components/Form/FormDynamic";
import HelmetSeo from "../../components/HelmetSeo";
import ApplicationsApi from "../../services/ApplicationService";
import {Button} from "antd";
import {updateFormHelper} from "../../services/utils";

class ApplicationDetail extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            scholarshipQuestions: null,
            application: null,
            applicationResponses: null,
        }
    }

    componentDidMount() {
        this.loadApplication();
    }

    loadApplication = () => {

        const {
            location : { search },
            match : { params : { appId } },
        } = this.props;
        const params = new URLSearchParams(search);
        const userId = params.get('user');
        const scholarshipId = params.get('scholarship');

        let applicationPromise;
        if(userId && scholarshipId) {
            applicationPromise = ApplicationsApi.getOrCreate(userId, scholarshipId)
        } else {
            applicationPromise = ApplicationsApi.get(appId)
        }

        applicationPromise
            .then(res => {
                const {application, scholarship} = res.data;


                const applicationResponses = JSON.parse(application.responses);

                const scholarshipQuestions = Object.values(scholarship.extra_questions).map(question => {
                    question.keyName = question.key;
                    question.placeholder = question.label;
                    return question;
                });

                this.setState({application, scholarship, scholarshipQuestions, applicationResponses});

            })
            .catch(err => {
                console.log({err})
            })
    };

    saveApplication = (event) => {
        event.preventDefault();
        const {applicationResponses, application} = this.state;
        ApplicationsApi
            .patch(application.id, {responses: JSON.stringify(applicationResponses)})
            .then(()=>{
            })
            .catch(err=> {
                console.log({err});
            })
    };

    updateForm = (event) => {
        const {applicationResponses} = this.state;

        this.setState({applicationResponses: updateFormHelper(applicationResponses, event)});

    };

    render () {

        const {application, scholarship, scholarshipQuestions, applicationResponses} = this.state;
        const { userProfile } = this.props;

        if (!application || ! scholarship) {
            return null;
        }

        const title = `${userProfile.first_name}'s Application for ${scholarship.name}`;
        const seoContent = {
            title,
        };
        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent} />
                <h3 className="text-center">{title}</h3>
                <FormDynamic onUpdateForm={this.updateForm}
                             model={applicationResponses}
                             inputConfigs={scholarshipQuestions}
                />
                <br />

                <Button onClick={this.saveApplication}
                        type="primary"
                        size="large">
                    Save Application
                </Button> <br/>
            </div>
        );
    }
}

const mapDispatchToProps = {
    updateLoggedInUserProfile
};
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

ApplicationDetail.propTypes = {
    // redux
    userProfile: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDetail);

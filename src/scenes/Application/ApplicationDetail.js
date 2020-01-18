import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import FormDynamic from "../../components/Form/FormDynamic";
import HelmetSeo from "../../components/HelmetSeo";
import ApplicationsApi from "../../services/ApplicationService";

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

        console.log('this.props', this.props);

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

    updateForm = (event) => {
        event.preventDefault();

        const {applicationResponses} = this.state;

        const applicationResponsesNew = {
            ...applicationResponses,
            [event.target.name]: event.target.value,
        };
        this.setState({applicationResponses: applicationResponsesNew});

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

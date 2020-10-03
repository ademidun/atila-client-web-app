import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import FormDynamic from "../../components/Form/FormDynamic";
import {
    scholarshipUserProfileSharedFormConfigs,
    toastNotify
} from "../../models/Utils";
import UserProfileAPI from "../../services/UserProfileAPI";
import {userProfileFormConfig, userProfileFormOnboarding} from "../../models/UserProfile";
import {transformLocation} from "../../services/utils";

const userProfileSharedFormConfigs = scholarshipUserProfileSharedFormConfigs
    .map(config => {
        config.className = null;
        return config;
    });

class UserProfileEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pageNumber: props.startingPageNumber,
            locationData: {},
            formErrors: {},
        }
    }

    updateForm = (event) => {
        if (event.stopPropagation) {
            event.stopPropagation();
        }

        const { updateLoggedInUserProfile, userProfile } = this.props;

        const value = event.target.value;

        let newUserProfile;
        if(['city', 'province', 'country'].includes(event.target.name)) {
            const locationData = transformLocation(event.target.value);
            this.setState({locationData});
            const city = locationData.city? [{name: locationData.city}] : userProfile.city;
            const province = locationData.province? [{name: locationData.province}] : userProfile.province;
            const country = locationData.country? [{name: locationData.country}] : userProfile.country;
            newUserProfile = {
                ...userProfile,
                city,
                province,
                country,
            };

        } else {

            let newValue = userProfile[event.target.name];
            if ( Array.isArray(userProfile[event.target.name]) && !Array.isArray(value) ) {
                newValue.push(value);
            } else {
                newValue =value;
            }
            newUserProfile = {
                ...userProfile,
                [event.target.name]: newValue
            };
        }

        updateLoggedInUserProfile(newUserProfile);
    };

    changePage = (pageNumber) => {
        this.setState({pageNumber})
    };

    submitForm = (event) => {

        event.preventDefault();
        const { userProfile, afterSubmitSuccess } = this.props;
        const { formErrors} = this.state;

        if (!userProfile.major) {

            formErrors['major'] = (
                <p className="text-danger">
                    Major is a required field, please fill
                </p>);

        }
        else {
            delete formErrors['major'];
        }

        if (!userProfile.post_secondary_school) {
            formErrors['post_secondary_school'] = (
                <p className="text-danger">
                    Post secondary school is a required field, please fill.
                </p>);

        }
        else {
            delete formErrors['post_secondary_school'];
        }
        this.setState({ formErrors });
        userProfile.metadata['stale_cache'] = true;
        const { locationData } = this.state;
        UserProfileAPI
            .update({userProfile, locationData }, userProfile.user)
            .then(res=>{
                toastNotify('😃 User Profile successfully saved!');
                afterSubmitSuccess();
            })
            .catch(err=> {
                let postError = err.response && err.response.data;
                postError = JSON.stringify(postError, null, 4);

                toastNotify(`🙁${postError}`, 'error');
        });
    };

    render () {

        const { userProfile, title, className, submitButtonText } = this.props;
        const { pageNumber, formErrors } = this.state;

        let formErrorsContent = Object.keys(formErrors).map((errorType) => (
            <div key={errorType}>
                {formErrors[errorType]}
            </div>
        ));

        [userProfileFormOnboarding, userProfileFormConfig, userProfileSharedFormConfigs]
            .forEach(formConfigSettings => {
            for (let i = 0; i < formConfigSettings.length; i++) {
                if (Object.keys(formErrors).includes( formConfigSettings[i].keyName)) {
                    formConfigSettings[i].error = formErrors[ formConfigSettings[i].keyName];
                } else {
                    formConfigSettings[i].error = null;
                }
            }
        });



        return (
            <div className={className}>
                {title}
                {/*startingPageNumber is zero when user first registers*/}
                {/*Don't show Premium when first onboarding user. */}
                {/*{startingPageNumber !==0 &&*/}
                {/*    <Row style={{textAlign: 'left'}}>*/}
                {/*        <Col sm={24} md={12}>*/}
                {/*            <span><strong> Account Type: </strong>*/}
                {/*                Student {userProfile.is_atila_premium ? 'Premium' : 'Free'}</span>*/}
                {/*            {!userProfile.is_atila_premium &&*/}
                {/*            <Button style={{ marginTop: 16 }}*/}
                {/*                    className="m-3"*/}
                {/*                    type="primary">*/}
                {/*                <Link to="/premium">*/}
                {/*                    Go Premium*/}
                {/*                </Link>*/}
                {/*            </Button>*/}
                {/*            }*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*}*/}
                {pageNumber === 0 &&
                <FormDynamic onUpdateForm={this.updateForm}
                             model={userProfile}
                             inputConfigs=
                                 {userProfileFormOnboarding}
                />}
                {pageNumber === 1 &&
                <FormDynamic onUpdateForm={this.updateForm}
                             model={userProfile}
                             inputConfigs=
                                 {userProfileFormConfig}
                />}
                {pageNumber === 2 &&
                <FormDynamic onUpdateForm={this.updateForm}
                             model={userProfile}
                             inputConfigs=
                                 {userProfileSharedFormConfigs}
                />}
                <div className="my-2" style={{clear: 'both'}}>
                    {pageNumber !== 2 &&
                    <button className="btn btn-outline-primary float-right col-md-6"
                            onClick={() => this.changePage(pageNumber+1)}>Next</button>}
                    {pageNumber > 1 &&
                    <button className="btn btn-outline-primary float-left col-md-6"
                            onClick={() => this.changePage(pageNumber-1)}>Prev</button>}
                </div>
                {
                    Object.keys(formErrors).length > 0 &&
                    formErrorsContent
                }
                <button type="submit"
                        className="btn btn-primary col-12 mt-2"
                        onClick={this.submitForm}>{submitButtonText}</button>
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

UserProfileEdit.defaultProps = {
    title: (<h1 className="mt-3">Edit Profile</h1>),
    className: '',
    startingPageNumber: 1,
    afterSubmitSuccess: () => {},
    submitButtonText: 'Save'
};

UserProfileEdit.propTypes = {
    // redux
    userProfile: PropTypes.shape({}).isRequired,
    updateLoggedInUserProfile: PropTypes.func.isRequired,
    title: PropTypes.node,
    className: PropTypes.string,
    afterSubmitSuccess: PropTypes.func,
    startingPageNumber: PropTypes.number,
    submitButtonText: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit);

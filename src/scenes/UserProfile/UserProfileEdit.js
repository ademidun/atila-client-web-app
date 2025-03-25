import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { Button, message } from "antd";
import { updateLoggedInUserProfile } from "../../redux/actions/user";
import FormDynamic from "../../components/Form/FormDynamic";
import {
    scholarshipUserProfileSharedFormConfigs,
    toastNotify
} from "../../models/Utils";
import UserProfileAPI from "../../services/UserProfileAPI";
import { userProfileFormConfig, userProfileFormOnboarding } from "../../models/UserProfile";
import { scrollToElement, transformLocation } from "../../services/utils";
import SecurityQuestionAndAnswer from "../Application/SecurityQuestionAndAnswer";
import FileInput from "../../components/Form/FileInput";

let autoSaveTimeoutId;

// although maxPageNumber is just 1, the reason we didn't delete this value completely and get rid of page navigation
//  is because in the onboarding the initial page number is zero
const maxPageNumber = 1;

function UserProfileEdit({ 
    startingPageNumber = 1,
    userProfile,
    updateLoggedInUserProfile,
    title = <h1 className="mt-3">Edit Profile</h1>,
    className = '',
    afterSubmitSuccess = () => {},
    submitButtonText = 'Save',
    showSecurityQA = true
}) {
    const [pageNumber, setPageNumber] = useState(startingPageNumber);
    const [locationData, setLocationData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (location && location.hash) {
            scrollToElement(location.hash);
        }
    }, [location]);

    const updateForm = (event) => {
        if (event.stopPropagation) {
            event.stopPropagation();
        }

        const value = event.target.value;

        let newUserProfile;
        if(['city', 'province', 'country'].includes(event.target.name)) {
            const newLocationData = transformLocation(event.target.value);
            setLocationData(newLocationData);
            const city = newLocationData.city ? [{name: newLocationData.city}] : userProfile.city;
            const province = newLocationData.province ? [{name: newLocationData.province}] : userProfile.province;
            const country = newLocationData.country ? [{name: newLocationData.country}] : userProfile.country;
            newUserProfile = {
                ...userProfile,
                city,
                province,
                country,
            };
        } else {
            let newValue = userProfile[event.target.name];
            if (Array.isArray(userProfile[event.target.name]) && !Array.isArray(value)) {
                newValue.push(value);
            } else {
                newValue = value;
            }
            newUserProfile = {
                ...userProfile,
                [event.target.name]: newValue
            };
        }

        updateLoggedInUserProfile(newUserProfile);
        if (pageNumber !== 0) {
            if (autoSaveTimeoutId) {
                clearTimeout(autoSaveTimeoutId);
            }
            autoSaveTimeoutId = setTimeout(() => {
                submitForm({});
            }, 1000);
        }
    };

    const changePage = (newPageNumber) => {
        setPageNumber(newPageNumber);
        submitForm({});
    };

    const submitForm = (event) => {
        if (event.preventDefault) {
            event.preventDefault();
        }

        const newFormErrors = { ...formErrors };

        if (!userProfile.major) {
            newFormErrors['major'] = (
                <p className="text-danger">
                    Major is a required field, please fill
                </p>);
        } else {
            delete newFormErrors['major'];
        }

        if (!userProfile.post_secondary_school) {
            newFormErrors['post_secondary_school'] = (
                <p className="text-danger">
                    Post secondary school is a required field, please fill.
                </p>);
        } else {
            delete newFormErrors['post_secondary_school'];
        }
        
        setFormErrors(newFormErrors);
        userProfile.metadata['stale_cache'] = true;

        UserProfileAPI
            .update({ userProfile, locationData }, userProfile.user)
            .then(res => {
                message.success('😃 User Profile successfully saved!');
                afterSubmitSuccess();
            })
            .catch(err => {
                let postError = err.response && err.response.data;
                postError = JSON.stringify(postError, null, 4);
                toastNotify(`🙁${postError}`, 'error');
            });
    };

    let formErrorsContent = Object.keys(formErrors).map((errorType) => (
        <div key={errorType}>
            {formErrors[errorType]}
        </div>
    ));

    [userProfileFormOnboarding, userProfileFormConfig, scholarshipUserProfileSharedFormConfigs]
        .forEach(formConfigSettings => {
            formConfigSettings.forEach(currentConfig => {
                currentConfig.error = formErrors[currentConfig.keyName] || null;
            });
        });

    return (
        <div className={className}>
            {title}
            {/*startingPageNumber is zero when user first registers*/}
            {/*Don't show scholarshipPaymentForm when first onboarding user. */}
            {/*{startingPageNumber !==0 &&*/}
            {/*    <Row style={{textAlign: 'left'}}>*/}
            {/*        <Col sm={24} md={12}>*/}
            {/*            <span><strong> Account Type: </strong>*/}
            {/*                Student {userProfile.is_atila_premium ? 'scholarshipPaymentForm' : 'Free'}</span>*/}
            {/*            {!userProfile.is_atila_premium &&*/}
            {/*            <Button style={{ marginTop: 16 }}*/}
            {/*                    className="m-3"*/}
            {/*                    type="primary">*/}
            {/*                <Link to="/premium">*/}
            {/*                    Go ScholarshipPaymentForm*/}
            {/*                </Link>*/}
            {/*            </Button>*/}
            {/*            }*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*}*/}
            {pageNumber !== 0 &&
                <p className="text-muted">
                    User Profile Changes are Automatically Saved
                </p>
            }
            {pageNumber === 0 &&
                <FormDynamic onUpdateForm={updateForm}
                            model={userProfile}
                            inputConfigs={userProfileFormOnboarding}
                />
            }
            {pageNumber === 1 &&
                <>
                    <FormDynamic onUpdateForm={updateForm}
                                model={userProfile}
                                inputConfigs={userProfileFormConfig}
                    />

                    <FormDynamic onUpdateForm={updateForm}
                                model={userProfile}
                                inputConfigs={scholarshipUserProfileSharedFormConfigs}
                    />
                    <div id="enrollment-proof">
                        <FileInput
                            title={"Proof of Enrollment"}
                            keyName="enrollment_proof"
                            className="my-3"
                            onChangeHandler={updateForm}
                            type="image,pdf"
                            filePath={`user-profile-files/${userProfile.user}`}
                            uploadHint="Enrollment proof must be a PDF (preferred) or an image."
                        />
                        {userProfile.enrollment_proof &&
                            <div className="my-2">
                                <a href={userProfile.enrollment_proof} target="_blank" rel="noopener noreferrer">
                                    View Proof of Enrollment
                                </a>
                            </div>
                        }
                    </div>
                </>
            }
            <div>
                <div className="my-2">
                    {pageNumber > 0 && pageNumber < maxPageNumber &&
                        <Button className="float-right col-md-6" size={"large"} type="primary"
                                onClick={() => changePage(pageNumber + 1)}>Next</Button>
                    }
                    {pageNumber > 1 &&
                        <Button className="float-left col-md-6" size={"large"} type="primary"
                                onClick={() => changePage(pageNumber - 1)}>Prev</Button>
                    }
                    <br />
                    <br />
                    {formErrorsContent}
                </div>
                <br/>
                {pageNumber !== 0 &&
                    <div className="text-muted my-2">
                        User Profile Changes are Automatically Saved
                    </div>
                }
                {pageNumber === 0 &&
                    <Button type="primary"
                            className="col-12 mt-2"
                            size={"large"}
                            onClick={submitForm}>{submitButtonText}</Button>
                }
                <br/>
            </div>
            {showSecurityQA &&
                <div id="security">
                    <hr/>
                    <SecurityQuestionAndAnswer setAnswer={true} verifyAnswer={true}/>
                </div>
            }
        </div>
    );
}

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

UserProfileEdit.propTypes = {
    userProfile: PropTypes.shape({}).isRequired,
    updateLoggedInUserProfile: PropTypes.func.isRequired,
    title: PropTypes.node,
    className: PropTypes.string,
    afterSubmitSuccess: PropTypes.func,
    startingPageNumber: PropTypes.number,
    submitButtonText: PropTypes.string,
    showSecurityQA: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit);

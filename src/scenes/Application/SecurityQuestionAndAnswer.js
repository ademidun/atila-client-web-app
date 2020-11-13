import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import { Row, Col, Select, Button } from 'antd';
import {USER_PROFILE_SECURITY_QUESTIONS} from "../../models/UserProfile";
import UserProfileAPI from "../../services/UserProfileAPI";
import {PasswordShowHide} from "../../components/Register";

const { Option } = Select;

class SecurityQuestionAndAnswer extends  React.Component{

    constructor(props) {
        super(props);

        const {userProfile} = props;

        this.state = {
            securityQuestion: userProfile.security_question || USER_PROFILE_SECURITY_QUESTIONS[0],
            securityQuestionAnswer: "",
        }
    }

    saveSecurityQuestionAndAnswer = (event) => {

        event.preventDefault();

        const { userProfile,updateLoggedInUserProfile } = this.props;
        const { securityQuestion, securityQuestionAnswer } = this.state;

        this.setState({isLoading: true});

        const userProfileUpdateData = {
            security_question: securityQuestion,
            security_question_answer: securityQuestionAnswer,
        };

        UserProfileAPI.setSecurityQuestionAndAnswer(
            userProfileUpdateData, userProfile.user)
            .then(res => {
                updateLoggedInUserProfile(res.data.user_profile);
            })
            .catch(err=> {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    };

    onUpdateAnswer = (event) => {
        this.setState({securityQuestionAnswer: event.target.value});

    };

    onQuestionChange = (selectedQuestion) => {
        this.setState({securityQuestion: selectedQuestion});
    };

    render() {

        const { securityQuestion, securityQuestionAnswer } = this.state;
        const {userProfile} = this.props;

        return (
            <div className="mt-5">

                <h2>Add Security Question and Answer</h2>
                <h6 className="text-center">
                    You will need to answer this question to verify your account when accepting an award.
                </h6>

                {userProfile.security_question_is_answered &&
                <h6 className="text-center text-info">
                    Security question has already been answered. Message us if you would like to change your answer.
                </h6>
                }
                <Row gutter={16}>
                    <Col span={24} className="my-3">
                        <Select defaultValue={securityQuestion}
                                style={{ width: '100%' }}
                                onChange={this.onQuestionChange}
                                disabled={userProfile.security_question_is_answered}>
                            {USER_PROFILE_SECURITY_QUESTIONS.map((securityQuestion) => (
                                <Option key={securityQuestion} value={securityQuestion}>{securityQuestion}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24} className="my-3">
                        <p className="text-muted">
                            Your security answer
                        </p>
                        <PasswordShowHide password={securityQuestionAnswer}
                                          updateForm={this.onUpdateAnswer}
                                          disabled={userProfile.security_question_is_answered}
                                          placeholder={userProfile.security_question_is_answered ? "-------" : "Security Answer"}/>
                    </Col>
                </Row>


                <Button type="primary"
                        onClick={this.saveSecurityQuestionAndAnswer}
                        disabled={userProfile.security_question_is_answered}>
                    Save Security Question and Answer
                </Button>

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

SecurityQuestionAndAnswer.propTypes = {
    // redux
    userProfile: PropTypes.shape({}).isRequired,
    updateLoggedInUserProfile: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SecurityQuestionAndAnswer);
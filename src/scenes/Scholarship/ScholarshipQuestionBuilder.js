import React from 'react';
import PropTypes from "prop-types";
import {Input, Button, Popconfirm, Select, Space, Col, Row} from 'antd';
import {ScholarshipPropType} from "../../models/Scholarship";
import {getRandomString, slugify} from "../../services/utils";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const defaultSpecificQuestion = {
    key: 'why-do-you-deserve-this-scholarship',
    question: "Why do you deserve this scholarship?",
    type: 'long_answer',
};

const questionTypesLabel = {
    "short_answer": "Short Answer",
    "medium_answer": "Medium Answer (Under 300 words)",
    "long_answer": "Long Answer (Over 300 words)",
};

const questionTypes = ['short_answer', 'medium_answer', 'long_answer'];

export default class ScholarshipQuestionBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Question',
                dataIndex: 'question',
                editable: true,
            },
            {
                title: 'Question Type',
                dataIndex: 'type',
                editable: true,
            },
            {
                title: 'Remove Question',
                dataIndex: 'operation',
                render: (text, record) => (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                        <p className="text-danger cursor-pointer">Remove</p>
                    </Popconfirm>
                ),
            },
        ];
    }

    updateQuestions = (event, eventType, questionIndex) => {

        const { scholarship, onUpdate } = this.props;

        let specificQuestions = scholarship.specific_questions;

        const questionToEdit = specificQuestions[questionIndex];

        let value = event;
        let name = eventType;

        if (eventType === "question") {
            value = event.target.value;

            // If the question has a key that is already in the list, append a random hash to the
            // end of the question key.
            let questionKey = slugify(value, 50);
            let existingQuestionIndex = specificQuestions.findIndex((question) =>
                question.key === questionKey);
            if ( existingQuestionIndex > -1 && existingQuestionIndex !== questionIndex) {
                questionKey = `${questionKey}-${getRandomString(5)}`
            }
            questionToEdit.key = questionKey;
        }
        questionToEdit[name] = value;

        specificQuestions[questionIndex] = questionToEdit;

        const syntheticEvent = {
            target: {
                value: [...specificQuestions],
                name: "specific_questions"
            }
        };

        onUpdate(syntheticEvent);


    };

    addQuestion = () => {
        const { scholarship, onUpdate } = this.props;
        let specificQuestions = scholarship.specific_questions;

        const newSpecificQuestion = {...defaultSpecificQuestion};
        // If the newSpecificQuestion has a key that is already in the list, append the index to
        // the end of the question key.
        if (specificQuestions.findIndex((question) =>
            question.key === newSpecificQuestion.key) > -1) {
            newSpecificQuestion.key = `${newSpecificQuestion.key}-${specificQuestions.length}`;
        }

        specificQuestions.push(newSpecificQuestion);

        const syntheticEvent = {
            target: {
                value: [...specificQuestions],
                name: "specific_questions"
            }
        };

        onUpdate(syntheticEvent);
    };

    removeQuestion = (questionIndex) => {

        const { scholarship, onUpdate } = this.props;
        let specificQuestions = scholarship.specific_questions;

        specificQuestions.splice(questionIndex, 1);

        const syntheticEvent = {
            target: {
                value: [...specificQuestions],
                name: "specific_questions"
            }
        };

        onUpdate(syntheticEvent);
    };

    render() {
        const { scholarship } = this.props;

        let specificQuestions = scholarship.specific_questions;

        return (
            <div>
                    {specificQuestions.map((specificQuestion, index) => (
                        <React.Fragment>
                            <Row className="mb-3" gutter={[{ xs: 8, sm: 16}, 16]}>
                                    <Col sm={24} md={24} lg={16}>
                                        <Input value={specificQuestion.question}
                                               className="col-12"
                                               onChange={(event) =>
                                                   this.updateQuestions(event,'question', index)}/>

                                    </Col>
                                    <Col xs={24} md={24} lg={8}>
                                        <Space>
                                            <Select placeholder="Choose Type"
                                                    value={specificQuestion.type} onChange={(value) =>
                                                this.updateQuestions(value,'type', index)}>
                                                {questionTypes.map(item => (
                                                    <Select.Option key={item} value={item}>
                                                        {questionTypesLabel[item]}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                            <MinusCircleOutlined
                                                onClick={() => {
                                                    this.removeQuestion(index);
                                                }}
                                            />
                                        </Space>

                                    </Col>
                            </Row>
                            <hr/>
                        </React.Fragment>
                    ))}

                <Button
                    type="dashed"
                    onClick={() => {
                        this.addQuestion();
                    }}
                    block
                >
                    <PlusOutlined /> Add Question
                </Button>
            </div>
        );
    }
}

ScholarshipQuestionBuilder.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
    onUpdate: PropTypes.func,
};



// ---------------------- ScholarshipUserProfileQuestionBuilder
const { Option } = Select;
const children = [];

const userProfileQuestionOptions = [
    "first_name",
    "last_name",
    "email",
    "post_secondary_school",
    "major",
    "eligible_programs",
    "eligible_major",
    "ethnicity",
    "country",
    "citizenship",
    "extracurricular_description",
    "academic_career_goals",
];

for (let i in userProfileQuestionOptions) {
    const questionOption = userProfileQuestionOptions[i];
    children.push(<Option key={questionOption}
                          value={questionOption}>{questionOption}</Option>);
}

const defaultUserProfileQuestions = [userProfileQuestionOptions[0], userProfileQuestionOptions[1], userProfileQuestionOptions[2]];

export class ScholarshipUserProfileQuestionBuilder extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userProfileQuestions: defaultUserProfileQuestions,
            size: 'default',
        };
    }

    handleChange = (value) => {

        const { onUpdate } = this.props;
        const newUserProfileQuestions = value.map(question => (
            {key: question}
        ));
        const syntheticEvent = {
            target: {
                value: newUserProfileQuestions,
                name: "user_profile_questions"
            }
        };

        onUpdate(syntheticEvent);
    };

    render() {

        const { scholarship } = this.props;

        let userProfileQuestions = scholarship.user_profile_questions.length > 0 ?
            scholarship.user_profile_questions.map(question => question.key) : defaultUserProfileQuestions;

        return (
            <Select mode="tags" style={{ width: '100%' }}
                    value={userProfileQuestions}
                    placeholder="User Profile Questions"
                    onChange={this.handleChange}>
                {children}
            </Select>
        );
    }
}

ScholarshipUserProfileQuestionBuilder.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
    onUpdate: PropTypes.func,
};
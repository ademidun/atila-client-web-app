import React from 'react';
import PropTypes from "prop-types";
import {Input, Button, Popconfirm, Form, Select, Space} from 'antd';
import {ScholarshipPropType} from "../../models/Scholarship";
import {prettifyKeys, slugify} from "../../services/utils";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


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

    handleSave = (row) => {
        const { scholarship } = this.props;
        let specificQuestions = scholarship.specific_questions;
        const newQuestions = [...specificQuestions];
        const index = newQuestions.findIndex((item) => row.question === item.question);
        const item = newQuestions[index];


        newQuestions.splice(index, 1, { ...item, ...row });

        newQuestions.forEach((specificQuestion, index, theArray) => {
            theArray[index].key = slugify(theArray[index].question);
        });
        this.updateParent(newQuestions);
    };

    updateParent = (newQuestions) => {
        const { onUpdate } = this.props;

        /*
            ScholarshipAddEdit.updateForm() expects data in the form event.target.value and event.target.name.
         */
        const syntheticEvent = {
            target: {
                value: newQuestions.slice(),
                name: "specific_questions"
            }
        };

        onUpdate(syntheticEvent);
    };

    updateForm = (event) => {
        event.preventDefault();
        console.log("Updated Form")
    };
    onFinish = values => {
        console.log('Received values of form:', values);
    };

    addQuestion = () => {
        console.log("addQuestion");
    };

    removeQuestion = (questionKey) => {
        console.log({questionKey});
    };

    render() {
        const { scholarship } = this.props;

        let specificQuestions = scholarship.specific_questions;

        return (
            <div>
                    {specificQuestions.map(specificQuestion => {
                        console.log({specificQuestion});
                        return (
                            <div className="mb-3">
                                <Input value={specificQuestion.question}/>
                                <Select placeholder="Choose Type"
                                        value={specificQuestion.type}>
                                    {questionTypes.map(item => (
                                        <Select.Option key={item} value={item}>
                                            {prettifyKeys(item)}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <MinusCircleOutlined
                                    onClick={() => {
                                        this.removeQuestion(specificQuestion.key);
                                    }}
                                />
                            </div>
                        )
                    })}

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
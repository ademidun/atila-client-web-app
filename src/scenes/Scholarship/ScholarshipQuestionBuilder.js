import React from 'react';
import PropTypes from "prop-types";
import {Input, Button, Popconfirm, Form, Select, Space} from 'antd';
import {ScholarshipPropType} from "../../models/Scholarship";
import {slugify} from "../../services/utils";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


const questionTypes = ['Short Answer', 'Medium Answer', 'Long Answer'];

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
    render() {
        const { scholarship } = this.props;

        let specificQuestions = scholarship.specific_questions;

        return (
            <div>

                <Form name="dynamic_form_nest_item" onFinish={this.onFinish} autoComplete="off">
                    <Form.List name="questions_form">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {fields.map(field => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'question']}
                                                fieldKey={[field.fieldKey, 'question']}
                                                rules={[{ required: true, message: 'Missing Question' }]}
                                            >
                                                <Input placeholder="Question" />
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                label="Question Type"
                                                name={[field.name, 'type']}
                                                fieldKey={[field.fieldKey, 'type']}
                                                rules={[{ required: true, message: 'Missing question type' }]}
                                            >
                                                <Select placeholder="Choose Type">
                                                    {questionTypes.map(item => (
                                                        <Select.Option key={item} value={item}>
                                                            {item}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <MinusCircleOutlined
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            block
                                        >
                                            <PlusOutlined /> Add Question
                                        </Button>
                                    </Form.Item>
                                </div>
                            );
                        }}
                    </Form.List>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
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
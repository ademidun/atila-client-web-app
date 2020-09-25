import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import {Table, Input, Button, Popconfirm, Form, Select} from 'antd';
import {ScholarshipPropType} from "../../models/Scholarship";
import {slugify} from "../../services/utils";

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async (e) => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const defaultSpecificQuestion = {
    key: 'why-do-you-deserve-this-scholarship',
    question: "Why do you deserve this scholarship?",
    type: 'long_answer',
};
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
const defaultUserProfileQuestions = [userProfileQuestionOptions[0], userProfileQuestionOptions[1], userProfileQuestionOptions[2]];

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

    handleDelete = (key) => {

        const { scholarship } = this.props;
        let specificQuestions = scholarship.specific_questions;
        specificQuestions = [...specificQuestions];

        const newQuestions = specificQuestions.filter((item) => item.key !== key);
        this.updateParent(newQuestions);
    };
    handleAdd = () => {
        const { scholarship } = this.props;

        let specificQuestions = scholarship.specific_questions;
        const newData = defaultSpecificQuestion;
        const newQuestions = [...specificQuestions, newData];
        this.updateParent(newQuestions);
    };
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

    render() {
        const { scholarship } = this.props;

        let specificQuestions = scholarship.specific_questions;

        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={specificQuestions}
                    columns={columns}
                />
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    Add a question
                </Button>
            </div>
        );
    }
}

ScholarshipQuestionBuilder.propTypes = {
    scholarship: ScholarshipPropType.isRequired,
    onUpdate: PropTypes.func,
};

const { Option } = Select;
const children = [];

for (let i in userProfileQuestionOptions) {
    const questionOption = userProfileQuestionOptions[i];
    children.push(<Option key={questionOption}
                          value={questionOption}>{questionOption}</Option>);
}

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
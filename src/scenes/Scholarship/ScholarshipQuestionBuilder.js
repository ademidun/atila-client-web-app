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

const defaultSpecificQuestions = [
    {
        key: 'why-do-you-deserve-this-scholarship',
        question: "Why do you deserve this scholarship?",
        question_type: 'short_answer',
    },
    {
        key: 'tell-me-about-yourself',
        question: "Tell me about yourself",
        question_type: 'long_answer',
    },
];

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
                dataIndex: 'question_type',
                editable: true,
            },
            {
                title: 'Remove Question',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.specificQuestions.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <p className="text-danger">Remove</p>
                        </Popconfirm>
                    ) : null,
            },
        ];

        const { scholarship } = props;

        console.log({scholarship});

        this.state = {
            specificQuestions: scholarship.specific_questions.length ? scholarship.specific_questions : defaultSpecificQuestions,
            count: 2,
        };
    }

    handleDelete = (key) => {
        const specificQuestions = [...this.state.specificQuestions];
        this.setState({
            specificQuestions: specificQuestions.filter((item) => item.key !== key),
        });
    };
    handleAdd = () => {
        const { count, specificQuestions } = this.state;
        const newData = {
            key: 'why-do-you-deserve-this-scholarship-new',
            question: "Why do you deserve this scholarship?",
            question_type: 'short_answer',
        };
        this.setState({
            specificQuestions: [...specificQuestions, newData],
            count: count + 1,
        });
    };
    handleSave = (row) => {

        const newSpecificQuestions = [...this.state.specificQuestions];
        const index = newSpecificQuestions.findIndex((item) => row.question === item.question);
        const item = newSpecificQuestions[index];


        newSpecificQuestions.splice(index, 1, { ...item, ...row });

        newSpecificQuestions.forEach((specificQuestion, index, theArray) => {
            console.log("theArray[index]", theArray[index]);
            theArray[index].key = slugify(theArray[index].question);
            console.log(theArray[index], theArray[index]);
        });

        this.setState({
            specificQuestions: newSpecificQuestions,
        });

        const { onUpdate } = this.props;

        /*
            ScholarshipAddEdit.updateForm() expects data in the form event.target.value and event.target.name.
         */
        const syntheticEvent = {
            target: {
                value: newSpecificQuestions,
                name: "specific_questions"
            }
        };

        onUpdate(syntheticEvent);
    };

    render() {
        const { specificQuestions } = this.state;
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
];

for (let i in userProfileQuestionOptions) {
    const questionOption = userProfileQuestionOptions[i];
    children.push(<Option key={questionOption}
                          value={questionOption}>{questionOption}</Option>);
}

function handleChange(value) {
    console.log(`selected ${value}`);
}
export class ScholarshipUserProfileQuestionBuilder extends React.Component {
    state = {
        size: 'default',
    };

    render() {
        return (
            <Select mode="tags" style={{ width: '100%' }}
                    defaultValue={['first_name', 'last_name']}
                    placeholder="User Profile Questions"
                    onChange={handleChange}>
                {children}
            </Select>
        );
    }
}

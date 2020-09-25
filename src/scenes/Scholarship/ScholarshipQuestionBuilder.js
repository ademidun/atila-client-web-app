import React, { useContext, useState, useEffect, useRef } from 'react';
import {Table, Input, Button, Popconfirm, Form, Select} from 'antd';
import {prettifyKeys} from "../../services/utils";

const EditableContext = React.createContext();

const QUESTION_TYPE_OPTIONS = ["short_answer", "long_answer"];

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

const EditableCell = ({title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    console.log({title, editable, children, dataIndex, record, handleSave, ...restProps });
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const { options } = restProps;

    console.log({title, restProps, options});

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
        let formItem;

        if (options) {
            formItem = (

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
                <Select
                    className="form-control"
                    value={prettifyKeys(record[dataIndex]||options[0])}
                    onChange={save}
                    ref={inputRef}
                >
                    {/*<option key={placeholder} disabled hidden>{placeholder}</option>*/}
                    {options.map(option => (<Select.Option key={option} value={option}>
                        {prettifyKeys(option)}
                    </Select.Option>))}
                </Select>
                </Form.Item>
            )
        } else {
            formItem = (
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
            );
        }



        childNode = editing ? formItem : (
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

export default class ScholarshipQuestionBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Questions',
                dataIndex: 'question',
                width: '30%',
                editable: true,
            },
            {
                title: 'age',
                dataIndex: 'age',
            },
            {
                title: 'question_type',
                dataIndex: 'question_type',
                editable: true,
                options: QUESTION_TYPE_OPTIONS

            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        this.state = {
            dataSource: [
                {
                    key: '0',
                    question: 'Edward King 0',
                    age: '32',
                    question_type: QUESTION_TYPE_OPTIONS[0],
                },
                {
                    key: '1',
                    question: 'Edward King 1',
                    age: '32',
                    question_type: QUESTION_TYPE_OPTIONS[0],
                },
            ],
            count: 2,
        };
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key),
        });
    };
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            question_type: QUESTION_TYPE_OPTIONS[0],
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };
    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
        });
    };

    render() {
        const { dataSource } = this.state;
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
                    ...col,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    Add a row
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}

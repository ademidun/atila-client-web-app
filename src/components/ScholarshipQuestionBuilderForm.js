import React from 'react';
import { Form, Input, Button, Space , Select} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const questionTypes = ['Short Answer', 'Medium Answer', 'Long Answer'];

export const ScholarshipQuestionBuilderForm = () => {
    const [form] = Form.useForm();

    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    return (
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
            <Form.List name="users">
                {(fields, { add, remove }) => {
                    return (
                        <div>
                            {fields.map(field => (
                                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'first']}
                                        fieldKey={[field.fieldKey, 'first']}
                                        rules={[{ required: true, message: 'Missing Question' }]}
                                    >
                                        <Input placeholder="Question" />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        label="Question Type"
                                        name={[field.name, 'question_type']}
                                        fieldKey={[field.fieldKey, 'question_type']}
                                        rules={[{ required: true, message: 'Missing question type' }]}
                                    >
                                        <Select>
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
    );
};
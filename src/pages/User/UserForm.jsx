import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Select,
} from 'antd'

const { Option } = Select;

export default class UserForm extends Component {
    static propTypes = {
        roleList: PropTypes.array,
        user: PropTypes.object,
        visible: PropTypes.bool
    }
    formRef = React.createRef();
    getInitForm = () => {
        const { username, phone, email, role_id } = this.props.user;
        this.formRef.current.setFieldsValue({
            username, phone, email, role_id
        })

    }
    componentDidMount() {
        this.getInitForm();
    }
    render() {
        const { user, roleList } = this.props;
        return (
            <Form
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 10,
                }}
                ref={this.formRef}>
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                        { required: true, message: '必须输入密码' },
                        { min: 4, message: '用户名至少4位' },
                        { max: 12, message: '用户名最多12位' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                    ]}
                >
                    <Input />
                </Form.Item>
                {
                    !user._id ? (
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                { required: true, message: '必须输入密码' },
                                { min: 4, message: '密码至少4位' },
                                { max: 12, message: '密码最多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成' }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    ) : null
                }
                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[
                        { required: true, message: '必须输入手机号' },
                        { min: 11, message: '手机号必须为11位' },
                        { max: 11, message: '手机号必须为1位' },
                        { pattern: /^[0-9_]+$/, message: '手机号必须为纯数字组成' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        { required: true, message: '必须输入邮箱' },
                        { 
                            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                            message: '请输入正确的邮箱格式' 
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="角色"
                    name="role_id"
                >
                    <Select style={{ width: 120 }} allowClear>
                        {
                            roleList.map(role => (
                                <Option value={role._id} key={role._id}>{role.name}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}

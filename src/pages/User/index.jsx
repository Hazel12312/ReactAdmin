import React, { Component } from 'react'
import {
    Card,
    Table,
    Modal,
    message,
    Button,
} from 'antd'
import {
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import UserForm from './UserForm'
import LinkButton from '../../components/LinkButton'
import { PAGE_SIZE } from '../../utils/constants'
// 引入将时间戳转化为时间的现实方法
import { formateDate } from '../../utils/dateUtils'
import {
    reqRole,
    reqUser,
    reqAddUpdateUser,
    reqDelectUser
} from '../../api'

const { confirm } = Modal;
export default class User extends Component {
    state = {
        users: [],
        loading: true,
        confirmLoading: false,       // 表单提交loading
        visible: false,         // 显示添加弹窗
        roleList: []
    }
    formRef = React.createRef();
    // 获取用户数据
    getUser = async () => {
        try {
            const response = await Promise.all([reqUser(), reqRole()]);
            let { status, data: { users } } = response[0];
            let { data } = response[1];
            const roleList = data.map(role => {
                const { _id, name } = role;
                return { _id, name }
            });
            // 确保在roleList存入state后find(role_name)
            this.setState({ roleList }, () => {
                if (status === 0 && users.length > 0) {
                    // 更新请求到的user的创建时间和所属角色
                    users = users.map(user => {
                        user.create_time = formateDate(user.create_time);
                        const role = this.state.roleList.find(role => role._id === user.role_id);
                        // 以免返回undefined报错
                        user.role_name = role === undefined ? null : role.name;
                        return user
                    })
                    this.setState({ users, loading: false });
                } else {
                    message.error('请求用户数据失败');
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    // 显示增加用户弹窗
    showAdd = () => {
        this.user = null
        this.setState({ visible: true });
    }
    // 显示修改用户弹窗
    showUpdate = (user) => {
        this.user = user;
        this.setState({ visible: true });
    }

    // 显示删除用户确认框
    showDelete = (user) => {
        // 必须从this中解构，否则在onOk()中无法读取
        const { handleDelete } = this;
        confirm({
            title: `确定删除${user.username}吗？`,
            icon: <ExclamationCircleOutlined />,
            content: '一旦删除不可撤销喔!',
            maskClosable: true,
            onOk() {
                handleDelete(user);
            },
        });
    }

    // 创建/修改用户回调事件
    handleAddUpdate = async () => {
        try {
            // 这里不能再从this.formRef.current中读取验证数据的方法
            // 因此先从this.formRef.current读取了UserForm组件的实例，后从实例上的formRef读取了表单实例，最后读取表单实例的方法
            const user = await this.formRef.current.formRef.current.validateFields();
            let msg = '添加'
            // 若为修改
            if (this.user) {
                user._id = this.user._id;
                msg = '修改'
            }
            const { status } = await reqAddUpdateUser(user);

            if (status === 0) {
                this.getUser();
                message.success(msg + '用户成功');
            } else {
                message.error(msg + '用户失败');
            }

        } catch (err) {
            console.log(err)
            message.error('获取添加用户表单数据失败');
        }
        this.setState({ visible: false })
    }
    // 删除用户回调事件
    handleDelete = async (user) => {
        const { status } = await reqDelectUser(user._id);
        if (status === 0) {
            this.getUser();
            message.success('删除用户成功！');
        } else {
            message.error('删除用户失败！')
        }
    }

    // 弹窗取消
    handleCancel = () => {
        this.setState({ visible: false })
    }
    UNSAFE_componentWillMount() {
        this.columns = [
            {
                title: '用户',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time'
            },
            {
                title: '所属角色',
                dataIndex: 'role_name',
                key: 'role_name'
            },
            {
                title: '操作',
                render: (user) => (
                    <>
                        <LinkButton onClick={() => { this.showUpdate(user) }}>修改</LinkButton>
                        <LinkButton onClick={() => { this.showDelete(user) }}>删除</LinkButton>
                    </>
                )

            },
        ]
    }
    componentDidMount() {
        this.getUser();
    }
    render() {
        const { users, confirmLoading, visible, roleList, loading } = this.state;
        let { columns } = this
        const user = this.user || {}
        const title = (
            <Button type='primary' ghost onClick={this.showAdd}>
                <PlusOutlined />
                创建用户
            </Button>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    dataSource={users}
                    columns={columns}
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                >

                </Table>
                {
                    this.state.visible &&
                    <Modal
                        title={user ? '修改用户' : '添加用户'}
                        visible={visible}
                        onOk={this.handleAddUpdate}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                    >
                        <UserForm user={user} ref={this.formRef} roleList={roleList} />
                    </Modal>
                }

            </Card>

        )
    }
}

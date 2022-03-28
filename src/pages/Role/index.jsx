import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Tree,
    message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PAGE_SIZE } from '../../utils/constants';
import { reqAddRole, reqRole, reqUpdateRole } from '../../api';
import { formateDate } from '../../utils/dateUtils';
import { logout } from '../../redux/action';
import menuList from '../../config/menuConfig.jsx';
// 本来要从其中读取auth_name，现在可以直接从redux中读取
// import memoryUtils from '../../utils/memoryUtils';

class Role extends Component {
    state = {
        roles: [],           // 所有角色的列表
        currentRole: {},     // 当前单选框选中的节点
        menuList: [{
            title: '平台权限',
            key: '/',
            children: menuList
        }],
        disabled: true,      // 设置权限按钮是否可用
        confirmLoading: false,  // 添加角色loading
        loading: true,
        visible: false,             // 0:都不显示，1:显示添加，2:显示增加
        expandedKeys: []            // Tree结构中的指定展开节点
    }

    // role = {};

    formRef = React.createRef();

    getRoles = async () => {
        const { status, data } = await reqRole();
        if (status === 0 && data.length >= 0) {
            const roles = data.map(role => {
                role.create_time = formateDate(role.create_time);
                role.auth_time = formateDate(role.auth_time);
                return role;
            })
            this.setState({ roles, loading: false })
        }
    }
    showAdd = () => {
        this.setState({ visible: 1 });
    }
    showSetAthu = () => {
        this.setState({ visible: 2 });
    }
    handleCancel = () => {
        this.setState({ visible: false })
    }
    // 添加回调函数
    handleAdd = async () => {
        try {
            const { roleName } = await this.formRef.current.validateFields();
            this.setState({ confirmLoading: true })
            const { status } = await reqAddRole(roleName);
            if (status === 0) {
                // 更新页面
                this.getRoles();
                // 取消弹窗显示
                this.setState({ confirmLoading: false, visible: false });
                message.success('添加对象成功');
            } else {
                message.error('添加对象失败');
            }
        } catch {
            message.error('表单验证失败');
        }
    }
    // 更新回调函数
    handleUpdate = async () => {
        this.setState({ confirmLoading: true })

        const auth_name = this.props.user.username;
        const auth_time = new Date().getTime();
        let {currentRole: {_id, menus}} = this.state;
        const role = {_id, menus, auth_name, auth_time};

        const {status} = await reqUpdateRole(role);
        if (status === 0) {
            // 若当前更新的是自己的角色权限，则强制退出
            if (role._id === this.props.user.role_id) {
                this.props.logout();
                message.success('修改当前用户角色权限成功, 请重新登录以更新');
            } else {
                this.getRoles();
                this.setState({ confirmLoading: false, visible: false });
                message.success('修改角色权限成功');
            }
        } else {
            message.error('修改角色权限失败');
        }
    }
    // 选中Tree中复选框的默认事件
    handleCheck = (menus) => {
        const {currentRole} = this.state;
        this.setState({currentRole:{...currentRole, menus}})
    }
    // 设置展开的节点
    setExpandedKeys = () => {
        const {currentRole: {menus}} = this.state;
        const expandedKeys = [];
        if (menus.length > 0) {
            expandedKeys.push('/');
            menus.map(menu => {
                if (menu.indexOf('/charts') === 0) {
                    expandedKeys.push('/charts');
                } else if (menu === '/product' || menu === '/category') {
                    expandedKeys.push('/products');
                }
                return expandedKeys;
            });
        }
        this.setState({expandedKeys});
    }
    UNSAFE_componentWillMount() {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time'
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                key: 'auth_time'
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name'
            },
        ];
    }
    componentDidMount() {
        this.getRoles();
    }
    render() {
        const { roles, loading, disabled, visible, confirmLoading, currentRole, menuList, expandedKeys } = this.state
        const { columns, formRef } = this;
        const title = (
            <div>
                <Button type='primary' ghost onClick={this.showAdd}>
                    <PlusOutlined />
                    创建用户
                </Button>
                &nbsp; &nbsp;
                <Button disabled={disabled} type='primary' ghost onClick={this.showSetAthu}>
                    设置角色权限
                </Button>
            </div>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    dataSource={roles}
                    columns={columns}
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                    rowSelection={{
                        type: 'radio',
                        onChange: (selected, selectedRows) => {
                            // selectedRowKeys: 当前被选中行的key值, selectedRows：当前被选中行，为一个数组
                            // 将设置权限按钮解封，并将当前选中行存入状态中
                            this.setState({ disabled: false, currentRole: selectedRows[0] }, () => {
                                // 在当前节点存入状态完毕后，将其所需要展开的树结构父节点也存入状态
                                this.setExpandedKeys()
                            });
                        }
                    }}

                >

                </Table>
                {/* 添加角色弹窗 */}
                <Modal
                    title={'添加角色'}
                    visible={visible === 1}
                    onOk={this.handleAdd}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form
                        ref={formRef}
                        wrapperCol={{
                            span: 12,
                        }}

                    >
                        <Form.Item
                            label='角色名称'
                            name='roleName'
                            rules={[
                                {
                                    required: true,
                                    message: '必须输入角色名称！'
                                }
                            ]}
                        >
                            <Input placeholder='请输入角色名称'></Input>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 修改权限弹窗 */}
                {
                    visible &&
                    <Modal
                        title={'修改角色权限'}
                        visible={visible === 2}
                        onOk={this.handleUpdate}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                    >
                        <Form
                            wrapperCol={{
                                span: 12,
                            }}
                        >
                            <Form.Item
                                label='角色名称'
                                name='roleName'
                                initialValue={currentRole.name}
                            >
                                <Input disabled></Input>
                            </Form.Item>
                        </Form>
                        <Tree
                            checkable
                            expandedKeys={expandedKeys} // 是否自动展开父节点
                            onCheck={this.handleCheck}
                            defaultCheckedKeys={currentRole.menus} // 默认选中的树节点复选框
                            treeData={menuList}             // 树的相关数据
                        />
                    </Modal>
                }
            </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {
        logout
    }
)(Role);
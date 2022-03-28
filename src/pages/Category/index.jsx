import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Select,
    Input,
    message
} from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
// 引入请求分类
import { reqCategory, reqAddCategory, reqUpdateCategory } from '../../api';
// 引入LinkButton
import LinkButton from '../../components/LinkButton'

// select组件中获取option
const { Option } = Select;
export default class Category extends Component {
    state = {
        dataSource: [],         // 一级分类列表数据
        subCategory: [],        // 二级分类列表
        parentId: '0',          // 父分类的Id
        parentName: '',          // 父分类名称
        loading: true,          // 表单数据的loading
        showLinkButton: 0,      // 0:都不显示， 1：增加按钮显示，2：更新按钮显示
        confirmLoading: false   // 设置Madal框的loading样式
    }
    // 创建addRef
    addRef = React.createRef()
    updateRef = React.createRef()

    // 获取表单数据
    getCategory = async (parentId) => {
        // 优先使用传入的parentId，若未指定则使用state的
        parentId = parentId || this.state.parentId;
        const category = await reqCategory(parentId);
        if (category.status === 0) {
            // 若父分类Id为0，则更新一级分类
            if (parentId === '0') {
                this.setState({ dataSource: category.data })
            } else {
                this.setState({ subCategory: category.data })
            }
            this.setState({ loading: false });
        }
    }

    // 显示指定分类的子分类列表
    showsubCates = (category) => {
        // 这里必须将getCategory的调用写在setState的第二个参数回调函数中，因为setState是异步的
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategory();
        })
    }
    // 显示一级列表
    showCategory = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategory: [],
            // showStatus: 0
        })
    }


    // 展示添加
    showAdd = () => {
        this.setState({ showLinkButton: 1 });
    }
    // 添加成功的回调
    handleAdd = async () => {
        try {
            // 获取表单中输入值
            const { parentId, categoryName } = await this.addRef.current.validateFields()
            this.setState({ confirmLoading: true })
            // 请求添加
            reqAddCategory(parentId, categoryName);
            if (parentId === this.setState.parentId) {
                this.getCategory()
            } else if (parentId === '0') {
                this.getCategory(parentId)
            }
            message.success("添加成功")
            this.setState({ confirmLoading: false, showLinkButton: 0 })
        } catch {
            message.error('填写表单不规范')
        }
    }

    // 展示修改
    showUpdate = (category) => {
        // 参数为当前点击修改的分类项，将其保存在 this中
        this.category = category;
        this.setState({ showLinkButton: 2 })
    }
    // 修改成功的回调
    handleUpdate = async () => {
        // 获取需要修改的id
        const categoryId = this.category._id
        // 获取表单填写的修改后分类名
        const { categoryName } = await this.updateRef.current.validateFields()
        this.setState({ confirmLoading: true })
        try {
            await reqUpdateCategory({ categoryId, categoryName });
            // 重写获取表单数据
            this.getCategory();
            // 重置表单
            this.updateRef.current.resetFields()
            this.setState({ showLinkButton: 0, confirmLoading: false })
            message.success('修改成功')

        } catch (err) {
            console.log(err)
            message.error('呜呜~分类修改失败');
        }

    }


    // 关闭添加与修改框
    handleCancel = () => {
        this.setState({ showLinkButton: 0 })
    }

    // 初次渲染钩子
    UNSAFE_componentWillMount() {
        // 表格每列的内容
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width: '30%',
                render: (category) => {
                    return (
                        <div>
                            <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
                            {
                                this.state.parentId === '0' ?
                                    <LinkButton onClick={() => { this.showsubCates(category) }}>查看子分类</LinkButton> : null
                            }
                        </div>
                    )
                }
            }]
    }

    // 挂载完成时发送请求获取表单数据
    componentDidMount() {
        this.getCategory();
    }

    render() {
        // 解构state中数据
        const { dataSource, subCategory, parentId, parentName, loading, confirmLoading, showLinkButton } = this.state;
        // Card显示内容
        // Card 左侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton style={{ fontSize: '16px' }} onClick={this.showCategory}>一级分类列表</LinkButton>
                <ArrowRightOutlined />&nbsp;&nbsp;&nbsp;
                <span style={{ fontSize: '14px' }}>{parentName}</span>
            </span>
        )
        // card按钮
        const extra = (() => {
            return (
                <Button onClick={this.showAdd} type='primary' ghost>
                    <PlusOutlined />
                    <span>添加</span>
                </Button>
            )
        })()


        return (
            <Card title={title} extra={extra}>
                {/* 表格结构：dataSource填写表单信息，columns填写表头信息 */}
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={parentId === '0' ? dataSource : subCategory}    // 判断展示哪一个目录
                    columns={this.columns}
                    pagination={{ pageSize: 5, showQuickJumper: true }}
                />

                {/* 添加输入框 */}
                {
                    showLinkButton === 1 &&
                    <Modal
                        title="添加分类"
                        visible={showLinkButton === 1}
                        onOk={() => { this.handleAdd() }}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                    >
                        <Form ref={this.addRef}>
                            <Form.Item
                                name="parentId"
                                label="父类目录"
                                initialValue={parentId}
                                hasFeedback
                                rules={[{ required: true, message: '分类目录必须填写哟!' }]}
                            >
                                <Select placeholder="选择您要添加分类的目录">
                                    <Option key="0" value="0">一级分类</Option>
                                    {
                                        dataSource.map(item => {
                                            return <Option key={item._id} value={item._id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="categoryName"
                                label="分类名称"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '分类名称必须填写哟！',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入您想添加的分类名称" />
                            </Form.Item>
                        </Form>
                    </Modal>
                }
                {/* 更新分类弹窗 */}
                <Modal
                    title="更新分类"
                    visible={showLinkButton === 2}
                    onOk={this.handleUpdate}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose      // 表示该组件每次重新加载都会重新更新
                >
                    <Form ref={this.updateRef}>
                        <Form.Item
                            name="categoryName"
                            label="分类名称"
                            hasFeedback
                            initialValue={this.category === undefined ? null : this.category.name}
                            rules={[
                                {
                                    required: true,
                                    message: '分类名称必须填写哟！',
                                },
                            ]}
                        >
                            <Input placeholder="请输入您想更改的分类名称" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        )
    }
}

import React, { Component } from 'react';
import {
    Card,
    Cascader,
    Form,
    Input,
    message,
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons'
// 引入请求方式
import {
    reqCategory
} from '../../api/index'

export default class ProductAddUpdate extends Component {
    state = {
        // 级联下拉框的一级下拉列表
        category: []
    }
    // 初始化级联列表
    initOptions = async (data) => {
        const category = data.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false       // 是否是叶子节点，无法判断其是否有子类，因此统一设置为有
        }))
        // 若当前为修改商品数据，且当前商品为二级分类商品
        this.setState({ category })
    }
    // 获取所有一级或二级分类
    getCategory = async (parentId) => {
        const { data } = await reqCategory(parentId);
        // 说明该分类为一级分类
        if (parentId === '0') {
            this.initOptions(data);
        } else {
            // 返回二级分类列表(作为async函数的Promise对象成功的返回值)
            return data;
        }
    }
    // 从详情页回退到home
    handleBack = () => {
        console.log(this.props)
        this.props.history.goBack();
    }
    // 级联输入框: 选择某个分类时的回调  
    loadData = async selectedOptions => {
        // 为确定点击的目标option，其值为存储在渲染数组中的值
        // 则可知value为category的Id值
        const targetOption = selectedOptions[0];
        // 点击后的加载效果
        targetOption.loading = true;

        // 异步发送请求 获取二级列表
        // 此时getCategory为一个async函数，返回值为 一个Promise，因此使用await接收
        const subData = await this.getCategory(targetOption.value);
        targetOption.loading = false    // 隐藏 loading
        // 若有子分类
        if (subData && subData.length > 0) {
            // 生成一个二级option
            const subCategory = subData.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 将二级option与当前点击一级option绑定
            targetOption.children = subCategory;
        } else {
            // 无子分类：改变其isLeaf属性
            targetOption.isLeaf = true;
        }
        // 更新option状态
        this.setState({category: [...this.state.category]})
    };

    componentDidMount() {
        this.getCategory('0')
    }
    render() {
        const title = (
            <>
                <ArrowLeftOutlined className='backArrow' onClick={this.handleBack} />
                <span>添加商品</span>
            </>
        )

        return (
            <Card title={title}>
                <Form
                    labelCol={{
                        span: 2,
                    }}
                    wrapperCol={{
                        span: 10,
                    }}
                    labelAlign='left'
                >
                    <Form.Item
                        label="商品名称"
                        name='name'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品名称！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="商品描述"
                        name='description'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品描述！',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="商品价格"
                        name='price'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品价格！',
                            }, {
                                min: 0,
                                message: '价格必须为有效数字！'
                            }
                        ]}
                    >
                        <Input type='number' prefix="￥" suffix="RMB" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="商品分类"
                        name='categroy'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品名称！',
                            },
                        ]}
                    >
                        <Cascader
                            options={this.state.category}
                            loadData={this.loadData}
                        />
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

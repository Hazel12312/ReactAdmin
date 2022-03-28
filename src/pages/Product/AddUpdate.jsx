import React, { Component } from 'react';
import {
    Card,
    Cascader,
    Form,
    Input,
    Button,
    message,
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons'
// 引入请求方式
import {
    reqCategory,
    reqAddOrUpdateProduct
} from '../../api/index'
import PicturesWall from './PictrueWall.jsx';
import RichTextEditor from './RichTextEditor';

export default class ProductAddUpdate extends Component {
    state = {
        options: []        // 级联下拉框的一级下拉列表
    }
    formRef = React.createRef();
    picRef = React.createRef();
    detailRef = React.createRef();

    // 从详情页回退到home
    handleBack = () => {
        console.log(this.props)
        this.props.history.goBack();
    }
    // 对价格表单进行自定义验证
    validatePrice = (rule, value, callback) => { 
        value = value * 1;
        if (value > 0) { 
            callback() 
        } else { 
            callback('价格必须是大于 0 的数值') 
        } 
    };

    // 初始化级联列表
    initOptions = async (data) => {
        // 初始化一级级联
        const options = data.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false       // 是否是叶子节点，无法判断其是否有子类，因此统一设置为有
        }))
        // 解决修改商品时二级级联列表不默认显示的问题
        const { isUpdate, product } = this
        const { pCategoryId, categoryId } = product;
        if (isUpdate && pCategoryId !== '0') {
            // 修改商品界面，获取其二级级联，显示默认值
            this.setState({ options }, async () => {
                const targetOption = options.find(category => category.value === pCategoryId);
                await this.loadData([targetOption]);
                this.formRef.current.setFieldsValue({
                    categoryIds: [pCategoryId, categoryId]
                })
            })
        } else {
            // 添加商品页面直接渲染其一级级联
            this.setState({ options }, () => {
                this.formRef.current.setFieldsValue({
                    categoryIds: [categoryId]
                })
            });
        }
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
        this.setState({ options: [...this.state.options] })
    };

    // 提交表单回调事件
    handleSubmit = async () => {
        const { formRef, picRef, detailRef, product, isUpdate } = this;
        try {
            const { name, desc, price, categoryIds } = await formRef.current.validateFields();

            // 错误写法：
            // const pCategoryId = categoryIds[0];
            // const CategoryId = categoryIds[1];

            // 若商品为一级分类
            let pCategoryId, categoryId;
            if (categoryIds.length === 1) {
                pCategoryId = '0';
                categoryId = categoryIds[0]
            } else {
                pCategoryId = categoryIds[0];
                categoryId = categoryIds[1];
            }
            const imgs = picRef.current.getImgs()
            const detail = detailRef.current.getDetail()
            // 创建提交的产品对象
            const productObj = { pCategoryId, categoryId, name, desc, price, imgs, detail };
            // 若此时为修改商品界面，则传入id值
            if (isUpdate && product._id) {
                const { _id } = product;
                // 注意：这里使用方括号来读取变量名时，必须为变量名打冒号，否则方括号中的值会被识别为一个变量
                productObj['_id'] = _id

            }
            const result = await reqAddOrUpdateProduct(productObj);
            if (result.status === 0) {
                message.success('保存商品成功');
                this.props.history.goBack();
            } else {
                message.success('表单提交出现异常，请稍后重试');
            }
        } catch (err) {
            message.error('表单验证失败');
        }
    }

    UNSAFE_componentWillMount() {
        const product = this.props.location.state;
        this.product = product || {};
        this.isUpdate = !!product;  // !!xxx 将一个数据强制转化成布尔类型值
    }
    componentDidMount() {
        this.getCategory('0')
    }
    render() {
        const { product, isUpdate, formRef, picRef, detailRef } = this;
        const { name, desc, price, imgs, detail } = product;
        const { options } = this.state;
        const title = (
            <>
                <ArrowLeftOutlined className='backArrow' onClick={this.handleBack} />
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
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
                    ref={formRef}
                >
                    <Form.Item
                        label="商品名称"
                        name='name'
                        initialValue={name}
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
                        name='desc'
                        initialValue={desc}
                        rules={[
                            {
                                required: true,
                                message: '请输入商品描述！',
                            }
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="商品价格"
                        name='price'
                        initialValue={price}
                        rules={[
                            {
                                required: true,
                                message: '请输入商品价格！',
                            },
                            { validator: this.validatePrice }
                        ]}
                    >
                        <Input type='number' prefix="￥" suffix="RMB" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="商品分类"
                        name='categoryIds'
                        // initialValue={categoryIds}       // 使用setFieldValue后就无需使用initialValue再设置初始值
                        rules={[
                            {
                                required: true,
                                message: '请输入商品分类！',
                            },
                        ]}
                    >
                        <Cascader
                            options={options}
                            loadData={this.loadData}
                        />
                    </Form.Item>
                    <Form.Item
                        label="商品图片"
                        name='imgs'
                    >
                        <PicturesWall ref={picRef} imgs={imgs} />
                    </Form.Item>
                    <Form.Item
                        label="商品详情"
                        name='detail'
                    >
                        <RichTextEditor ref={detailRef} detail={detail} />
                    </Form.Item>
                    <Form.Item style={{ marginTop: 100 }} wrapperCol={{ offset: 3, span: 8 }}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit} block>
                            提&nbsp;&nbsp;&nbsp;&nbsp;交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

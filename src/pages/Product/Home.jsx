import React, { Component } from 'react'
// 引入antd
import {
    Card,
    Form,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd'
import {
    PlusOutlined
} from '@ant-design/icons'
// 引入请求函数
import LinkButton from '../../components/LinkButton';
import {
    reqProuductList,
    reqSearchProduct,
    reqUpdateProductState,
} from '../../api'
// 引入每页数据条数
import { PAGE_SIZE } from '../../utils/constants'
import './index.less'

const { Option } = Select;
const { Search } = Input;

export default class ProductHome extends Component {
    searchRef = React.createRef();

    state = {
        pageLoading: true,      // 请求前页面加载效果
        pageNum: 1,             // 当前页
        total: 0,               // 总共数据数
        productList: [],         // 产品数据
    }
    // 请求商品数据
    getProduct = async (pageNum, pageSize) => {
        try {
            const {searchType, searchName} = await this.searchRef.current.validateFields()
            let products
            // 若搜索框中有搜索词，则调用searchProduct按关键词请求，反之则调用reqProduct
            if (searchName !== undefined) {
                products = await reqSearchProduct({pageNum, pageSize, searchType, searchName});
            } else {
                products = await reqProuductList(pageNum, pageSize);
            }
            if (products.status === 0) {
                const { pageNum, total, list } = products.data;
                this.setState({ 
                    pageNum, 
                    total, 
                    productList: list, 
                    pageLoading: false 
                })
            } else {
                message.error('请求商品数据失败');
            }
        } catch(err) {
            // 该catch捕获的是 this.searchRef.current.validateFields() 的错误
            // req的错误在ajax的封装中已经处理过了，因此因此无需在此捕获
            message.error('获取搜索表单数据失败');
        }

    }

    // 下架按钮点击事件
    withdrawProduct = async (productId, status) => {
        const {pageNum} = this.state;
        const response = await reqUpdateProductState(productId, (status === 1 ? 0 : 1));
        if (response.status === 0) {
            this.getProduct(pageNum, PAGE_SIZE);
            message.success('更新商品状态成功');
        } else {
            message.error('更新商品状态失败');
        }
    }
    // Table页改变回调：重新请求数据
    pageChange = (pageNum, pageSize) => {
        this.getProduct(pageNum, pageSize);
    }

    // 挂载组件前渲染表格列名
    UNSAFE_componentWillMount() {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
                width: '40%'
            },
            {
                title: '价格',
                dataIndex: 'price', 
                key: 'price'
            },
            {
                title: '状态',
                key: 'state',
                width: '13%',
                render: (product) => (
                    <>
                        <span style={{fontSize: 13, width: 50, marginBottom: '5px', display: 'inline-block'}}>{product.status ? '在售' : '已下架'}</span>
                        <Button type='primary' style={{fontSize: 12, width: 50, height: 30, padding: 0}} onClick={() => {this.withdrawProduct(product._id, product.status)}}>{product.status ? '下架' : '上架'}</Button>
                    </>
                )
            },
            {
                title: '操作',
                key: 'operate',
                render: (product) => (
                    <>
                        {/* push()方法可以接收两个参数 path 和 state */}
                        {/* 通过push传入的 state，保存在path的 this.props.loaction.state中 */}
                        <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                    </>
                )
            },
        ]
    }
    // 挂载组件完成发送请求
    componentDidMount = () => {
        this.getProduct(this.state.pageNum, PAGE_SIZE);
    }
    render() {
        // 解构state的值
        const { pageLoading, total, productList } = this.state;
        
        const title = (
            <Form ref={this.searchRef} layout="inline">
                <Form.Item name='searchType' initialValue="productName">
                    <Select style={{ width: 120 }}>
                        <Option value="productName">按名称搜索</Option>
                        <Option value="productDesc">按描述搜索</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="searchName" style={{ width: 120 }}>
                    <Search placeholder="关键字" allowClear style={{ width: 150 }}  onSearch={() => {this.getProduct(1, PAGE_SIZE)}} />
                </Form.Item>
            </Form>
        )
        // card按钮
        const extra = (
            <Button style={{ width: 90, padding: '4px 0px' }} onClick={this.showAdd} type='primary' ghost>
                <PlusOutlined />
                <span onClick={() => this.props.history.push('/product/addupdate')}>添加商品</span>
            </Button>
        )
        return (
            <div>
                <Card title={title} extra={extra} >
                    <Table
                        dataSource={productList}
                        columns={this.columns}
                        rowKey='_id'
                        bordered
                        loading={pageLoading}
                        pagination={{
                            total: total,
                            pageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: (pageNum) => {this.pageChange(pageNum, PAGE_SIZE)}       // 页码或PageSize改变回调
                        }}
                    />
                </Card>
            </div>
        )
    }
}

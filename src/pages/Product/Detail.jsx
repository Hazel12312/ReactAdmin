import React, { Component } from 'react'
import {
    Card,
    List,
} from 'antd'
import {
    ArrowLeftOutlined
} from '@ant-design/icons'
// 引入请求方法
import { reqCategoryFromId } from '../../api'
// 引入图片基本路径常量
import { BASE_IMG_PATH } from '../../utils/constants'

export default class ProductDetail extends Component {
    state = {
        cName: '',      // 一级分类名称
        cSonName: ''    // 二级分类名称
    }
    // 异步获取当前产品对应的分类名称
    getCategoryName = async () => {
        const { categoryId, pCategoryId } = this.props.location.state || {};
        // 如果处在一级分类下
        if (pCategoryId === '0') {
            const result = await reqCategoryFromId(categoryId);
            const cName = result.data.name;
            this.setState({ cName });
        } else {
            // 若处在二级分类下
            const results = await Promise.all([reqCategoryFromId(pCategoryId), reqCategoryFromId(categoryId)]);
            const result1 = results[0];
            const result2 = results[1];
            const cName = result1.data.name;
            const cSonName = result2.data.name;
            this.setState({ cName, cSonName });
        }
    }
    // 从详情页回退到home
    handleBack = () => {
        this.props.history.goBack();
    }
    componentDidMount() {
        this.getCategoryName()
    }
    render() {
        const title = (
            <>
                <ArrowLeftOutlined className='backArrow' onClick={this.handleBack} />
                <span>商品详情</span>
            </>
        )
        const { name, desc, price, imgs, detail } = this.props.location.state || {};
        const { cName, cSonName } = this.state; 
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <List.Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品价格:</span>
                        <span>{price + '元'}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName + (cSonName ? ' --> ' + cSonName : '')}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品图片:</span>
                        {imgs === undefined ? null : <span> {imgs.map(img => (<img src={BASE_IMG_PATH + img} alt="img" key={img} style={{ width: 150, height: 150, marginRight: 10, border: '1px solid black' }} />))} </span>} 
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品详情:</span>
                        <div dangerouslySetInnerHTML={{ __html: detail }}></div>
                    </List.Item>
                </List>
            </Card>
        )
    }
}

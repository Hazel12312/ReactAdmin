import React, { Component } from 'react'
import {Switch, Route} from 'react-router-dom'
// 引入路由组件
import ProductHome from './Home.jsx'
import ProductAddUpdate from './AddUpdate.jsx'
import ProductDetail from './Detail.jsx'

export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' exact component={ProductHome}/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
            </Switch>
        )
    }
}

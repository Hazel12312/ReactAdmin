import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';
// import memoryUtils from '../../utils/memoryUtils';
// 引入异步加载组件的方法
import asyncComponent from '../../utils/asyncComponent';
// 引入自定义组件
import Header from '../../components/Header';
import LeftNav from '../../components/LeftNav';
// import Home from '../Home';
// import Category from '../Category';
// import Product from '../Product';
// import Role from '../Role';
// import User from '../User';
// import Bar from '../Charts/bar';
// import Line from '../Charts/line';
// import Pie from '../Charts/pie';
// import NotFound from '../Not-found';

import logo from '../../assets/images/logo.png'
import './index.less'

const { Content, Footer, Sider } = Layout;

// 定义异步加载组件
const AsyncHome = asyncComponent(() => import('../Home'));
const AsyncCategory = asyncComponent(() => import('../Category'));
const AsyncProduct = asyncComponent(() => import('../Product'));
const AsyncRole = asyncComponent(() => import('../Role'));
const AsyncUser = asyncComponent(() => import('../User'));
const AsyncBar = asyncComponent(() => import('../Charts/bar'));
const AsyncLine = asyncComponent(() => import('../Charts/line'));
const AsyncPie = asyncComponent(() => import('../Charts/pie'));
const AsyncNotFound = asyncComponent(() => import('../Not-found'));

class Admin extends Component {

    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    render() {
        const { collapsed } = this.state;
        // 若内存中没有登陆状态，则回到login界面
        const user = this.props.user;
        if (!user._id) {
            return <Redirect to='/login' />
        }

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div style={{ margin: '15px' }} className="logo">
                        <img className='logo-img' src={logo} alt="logo" style={{ width: '35px', marginLeft: `${collapsed ? '8px' : '0'}` }} />
                        <span className='logo-word' style={{ opacity: `${collapsed ? '0' : '1'}` }}>嘻嘻的后台</span>
                    </div>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header className="site-layout-background">Header</Header>
                    <Content style={{ margin: '0 16px' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Switch>
                                {/* 在为输入路由且精确匹配时，显示home路由组件 */}
                                <Redirect from='/' to='/home' exact/>
                                <Route path='/home' component={AsyncHome} />
                                <Route path='/category' component={AsyncCategory} />
                                <Route path='/product' component={AsyncProduct} />
                                <Route path='/role' component={AsyncRole} />
                                <Route path='/user' component={AsyncUser} />
                                <Route path='/charts/bar' component={AsyncBar} />
                                <Route path='/charts/line' component={AsyncLine} />
                                <Route path='/charts/pie' component={AsyncPie} />
                                {/* <Redirect from='/' to='/home' exact/>
                                <Route path='/home' component={Home} />
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/role' component={Role} />
                                <Route path='/user' component={User} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/pie' component={Pie} /> */}
                                {/* 当以上所有路径都不匹配，则显示NotFound404路由 */}
                                <Route component={AsyncNotFound} />
                                {/* <Route component={NotFound} /> */}
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>推荐使用谷歌浏览器，以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        );
    }
}
export default connect(
    state => ({ user: state.user })
)(Admin);
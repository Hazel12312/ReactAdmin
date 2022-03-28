import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu } from 'antd';

// 导入操作标题的action方法
import { setHeadTitle } from '../../redux/action/index.js';
// 因为直接从prop中读取了服务器返回的user数据，因此无需再次读取
// import memoryUtils from '../../utils/memoryUtils.js'
import menuList from '../../config/menuConfig.jsx'

const { SubMenu } = Menu;

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname;
        if (path === '/') {
            this.props.setHeadTitle('首页');
        }
        return menuList.map(item => {
            // debugger;
            if (this.hasAuth(item)) {
                if (!item.children) {
                    // 一旦匹配上当前item路径，将item的title保存进redux
                    // 若第一次进入页面不为首页，则使用该条语句匹配
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        this.props.setHeadTitle(item.title);
                    }
                    return (
                        // 想让icon的值动态显示为item.icon
                        <Menu.Item key={item.key} icon={item.icon}>
                            {/* 点击路由时将当前路由标题设置在redux中 */}
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    // 如果当前请求路由与当前菜单的某个子菜单的key相匹配，则将菜单的key保存在openkey中
                    if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }
    
    // 判断当前用户是否有看到当前item对应菜单项的权限
    hasAuth = (item) => {
        const {key, isPublic} = item;
        const menus = this.props.user.role.menus;
        const username = this.props.user.username;
        // 若此项设置为公开 或 当前为admin登录 或 渲染菜单中含有当前项
        if (isPublic || username === 'admin' || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            // 若存在子节点的化则遍历其子节点是否含有显示项，并强行转化为 boolean值
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }

        // 否则则返回false不渲染菜单项
        return false;
    }

    // 在组件初次挂载之前调用函数渲染画面
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        // 解决商品详情页path不相等导致无法选中Link的问题
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {
            // 当前页面为商品或商品子路由界面
            path = '/product';
        }
        const selectKey = path;
        const openKey = this.openKey;
        return (
            <Menu
                theme="dark"
                selectedKeys={[selectKey]}
                defaultOpenKeys={[openKey]}
                mode="inline"
            >
                {
                    this.menuNodes
                }
            </Menu>

        )
    }
}
// 将UI组件和路由组件连接
export default connect(
    state => ({user: state.user}),
    {
        setHeadTitle
    }
)(withRouter(LeftNav));
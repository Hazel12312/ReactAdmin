import React, { Component } from 'react';
// 引入路由组件
import { Redirect } from 'react-router-dom';
// 引入connect
import { connect } from 'react-redux';
// 引入antd标签
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// 改用引入异步action
import { login } from '../../redux/action';
// 引入图片
import logo from '../../assets/images/logo.png';
// 引入样式
import './index.less';

class Login extends Component {
    // 创建ref以获取输入框的值
    formRef = React.createRef();
    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const values = await this.formRef.current.validateFields()
            // 此时的value可以获取form.Item中的值，并作为一个对象储存
            // form.Item的name，即为value的属性名
            const { username, password } = values;
            await this.props.login(username, password);
            // 因为login为异步请求，因此要加 await等待其结果
            if (!this.props.user.errorMsg) {
                message.success('登录成功！');
            } else {
                message.error('账号或密码输入错误！');
            }
        } catch (err) {
            // 统一验证的错误：errorInfo为一个对象
            console.log(err)
            message.error('账号密码不符合要求！');
        }
    }
    // componentWillUnmount = () => {
    //     reqLogin = null;
    // }

    render() {
        // 保存登陆状态, 若用户已经登录则自动跳转到admin
        const user = this.props.user;
        if (user && user._id) {
            return <Redirect to='/' />;
        }
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React全栈：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h3>用户登录</h3>
                    <Form className="login-form" ref={this.formRef}>
                        <Form.Item name='username' rules={[
                            { required: true, message: '必须输入用户名' },
                            { min: 4, message: '用户名至少4位' },
                            { max: 12, message: '用户名最多12位' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                        ]}>

                            <Input
                                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item name='password' rules={[
                            { required: true, message: '必须输入密码' },
                            { min: 4, message: '密码至少4位' },
                            { max: 12, message: '密码最多12位' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成' }
                        ]}>
                            <Input
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
// 1.前端表单验证
// 2.收集表单数据
// 废弃：const WrapLogin = Form.create()(Login)
export default connect(
    state => ({ user: state.user }),
    {
        login
    }
)(Login)
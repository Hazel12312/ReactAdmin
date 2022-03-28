// 定义能发送axios请求的函数模块
// 封装axios库, 函数的返回值是Promise对象
// 优化：
// 1.统一处理请求异常 
// 2.异步返回的不是 response，而是response.data

import axios from 'axios';
import { message } from 'antd';

// 请求url，请求参数，请求类型
export default (url, data = {}, type='GET') => {
    // 取代了axios原本返回的Promise对象，提前处理掉错误可能
    return  new Promise((resolve) => {
        // 1.执行ajax异步请求
        let Promise;
        if(type === 'GET') {
            // axios.get()第二个参数为配置对象
            Promise = axios.get(url,{
                params: data
            })
        } else {
            // axios.post()第二个参数为请求对象
            Promise = axios.post(url, data)
        }

        Promise.then(response => {
            // 2.如果成功，调用resolve()
            console.log(response)
            resolve(response.data);
        }).catch(err => {
            // 3.重点：如果失败，不调用reject(reason)，而是显示异常信息
            // 因为在第三步不调用reject也就不会返回失败态的promise
            // 更不用在外部每次都书写 catch
            message.error(err.message);
        })
    })
}

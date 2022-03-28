// 进行local数据存储管理的工具模块,将数据存储在localStore中达到
import store from 'store'

const USER_KEY = 'user_key'

export default {

    // 保存user
    saveUser (user) {
        // 该方法两个参数都必须是字符串形式
        // localStorage.setItem(USER_KEY, JSON.stringify(user));
        store.set(USER_KEY, user);
    },
    // 读取user
    getUser () {
        // 如果USER_KEY存在则返回，没有值则返回空对象，以防报错
        // return JSON.parse(localStorage.getItem(USER_KEY) || {});
        return store.get(USER_KEY) || {};
    },
    // 删除user
    removeUser() {
        // localStorage.removeItem(USER_KEY);
        store.remove(USER_KEY);
    }
}

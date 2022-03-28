// 包含应用中所有接口请求函数的模块
// 每个接口函数的返回值都是Promise
// 要求：能根据接口文档定义接口请求函数

import ajax from "./ajax";

const BASE = '/api'
// 登录接口请求函数
export const reqLogin =  (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

// 天气更新
export const reqWeather = () => ajax('https://restapi.amap.com/v3/weather/weatherInfo?city=360111&key=73e3121f8a251a23b0120317c455c46b');

// 获取品类
export const reqCategory = (parentId) => ajax(BASE + '/manage/category/list', {parentId});
// 添加分类，两种传参方式 ———— 直接传多个参数
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST');
// 更新品类名称，两种传参方式 ———— 从对象中解构
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');

// 根据分类ID获取分类
export const reqCategoryFromId = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId});
// 获取商品分页列表
export const reqProuductList = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize});
// 通过Name获取商品
export const reqSearchProduct = ({pageNum, pageSize, searchType, searchName}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
});
// 添加/更新商品
export const reqAddOrUpdateProduct = product => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add') , product, 'POST');
// 对商品进行上下架处理
export const reqUpdateProductState = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST');
// 删除商品图片
export const reqDeleteProductImg = name => ajax(BASE + '/manage/img/delete', {name}, 'POST')


// 请求用户列表
export const reqUser = () => ajax(BASE + '/manage/user/list')
// 添加/更新用户
export const reqAddUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? '/update' : 'add'), user, 'POST');
// 删除用户
export const reqDelectUser = userId => ajax(BASE + '/manage/user/delete', {userId}, 'POST');
// 请求角色列表
export const reqRole = () => ajax(BASE + '/manage/role/list');
// 添加角色
export const reqAddRole = roleName => ajax(BASE + 'manage/role/add', {roleName}, 'POST');
// 更新角色
export const reqUpdateRole = role => ajax(BASE + 'manage/role/update', role, 'POST');
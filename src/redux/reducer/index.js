// 引入合并reducer方法
import { combineReducers } from "redux";

import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from '../action/action-types';

import storageUtils from "../../utils/storageUtils";

// 管理header的Title
const initHeaderTltle = '首页';
function headTitle(state=initHeaderTltle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data;
        default:
            return state;
    }
}

// 管理user
const initUser = storageUtils.getUser();
function user(state=initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user;
        case SHOW_ERROR_MSG:
            return {...state, errorMsg: action.errorMsg};
        case RESET_USER:
            return {};
        default: 
            return state;
    }
}

// 合并暴露reducer
export default combineReducers({headTitle, user})
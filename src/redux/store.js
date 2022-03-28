// 引入构建store的方法
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

// 引入reducer
import allReducer from './reducer';

// 暴露store对象
export default createStore(allReducer, composeWithDevTools(applyMiddleware(thunk)));
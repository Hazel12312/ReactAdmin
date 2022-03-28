import React from 'react'
import './index.less'

// 通用的看起来像超链接的button组件
export default function LinkButton(props) {
    // console.log(props);
    return <button {...props} className='link-button'></button> 
}
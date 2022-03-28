import React, { Component } from "react";
import PropTypes from 'prop-types'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default class RichTextEditor extends Component {
    // 限定传入detail内容
    static propTypes = {
        detail: PropTypes.string
    }
    constructor (props) {
        super(props);
        const detail = this.props.detail;
        let editorState;
        // 若detail有值说明是修改商品页面，则对默认传入值做显示
        if (detail) {
            const blocksFromHtml = htmlToDraft(detail);
            // blocksFromHtml含有以下两个属性
            const {contentBlocks, entityMap} = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            editorState = EditorState.createWithContent(contentState);
        } else {
            // 添加商品页面，无默认值，创建空editorState
            editorState = EditorState.createEmpty();
        }
        this.state = {
            editorState
        }
    }
    // 当输入改变时立即保存状态数据, 该方法会接收到一个参数为当前editor的值
    onEditorStateChange = (editorState) => {
        this.setState({editorState});
    }
    // 父元素调用方法获得输入框数据
    getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

    render() {
        return (
            <Editor
                editorState={this.state.editorState}            // 输入框显示内容
                editorStyle={{height: 250, border: '1px solid #f1f1f1', padding: '0 30px'}}     // 输入框样式
                onEditorStateChange={this.onEditorStateChange}  // 输入框内容改变触发的回调函数
            />
        )
    }
}

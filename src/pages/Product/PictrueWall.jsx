import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_IMG_PATH, UPLOAD_IMG_NAME } from '../../utils/constants';
import { reqDeleteProductImg } from '../../api'

export default class PicturesWall extends Component {
  static propTypes = {
    // 限定图片为一个数组元素
    img: PropTypes.array
  }
  // 在组件初始化时，初始化fileList列表
  constructor(props) {
    super(props);
    let fileList = [];
    // 如果传入了 imgs, 生成一个对应的 fileList 
    const { imgs } = this.props;
    // 如果imgs数组中有值，则遍历数组将值传入
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done', // loading: 上传中, done: 上传完成, remove: 删除 
        url: BASE_IMG_PATH + img,
      }))
    }
    this.state = {
      previewVisible: false,      // 照片预览框是否可视
      previewImage: '',           // 预览照片的地址
      fileList
    };
  }

  // 得到当前已上传的图片文件名数组，后将该数组传给父组件做保存显示
  getImgs = () => this.state.fileList.map(file => file.name);

  // 关闭预览照片
  handleCancel = () => this.setState({ previewVisible: false });

  // 预览照片按钮
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,    // thumbUrl:给未上传成功的图片一个默认显示
      previewVisible: true,
    });
  };
  // 上传照片状态被改变时：上传中，完成，失败都会调用此回调
  // 该回调函数中默认接受3个参数：上传的file，当前的fileList，及服务端响应内容event
  handleChange = async ({ file, fileList }) => {
    console.log(file)
    // 图片上传成功标识
    if (file.status === 'done') {
      // result为服务器返回的结果数据 
      // 上传成功：{state: 0， data: {name: 服务器中图片名, url: 服务器中图片地址}}
      const result = file.response;
      if (result.status === 0) {
        message.success('上传成功了');
        // 因为此时file中返回的信息与服务器中保存图片的信息不一致，因此需要修正
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error('上传失败了');
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteProductImg(file.name);
      if (result.status === 0) {
        message.success('删除图片成功');
      } else {
        message.error('删除图片失败');
      }
    }
    // 更新 fileList 状态 
    this.setState({ fileList })
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    // 上传照片按钮
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload"        // 上传的地址 
          accept="image/*"                   // 接受上传的文件类型，表示接收一切图片类型
          name={UPLOAD_IMG_NAME}             // 发送到后台的文件请求参数名————接口规定为：image
          listType="picture-card"            // 已上传的图片通过什么样式显示
          fileList={fileList}                // 已上传的文件列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {/* 设置上传照片不能大于4张 */}
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        {/* 预览照片框 */}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="product-img" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
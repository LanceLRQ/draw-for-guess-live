import 'cropperjs/dist/cropper.css';
import React, { useEffect, useState } from 'react';
import {
  PageHeader, Button, Modal, Form, Input, Select, Row, Col, Upload, message, Image
} from 'antd';
import { useDispatch } from 'react-redux';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRiddleList } from '@/scripts/store/sagas';
import ReactCropper from 'react-cropper';

export const SettingView = () => {
  const [isShowEditDialog, setIsShowEditDialog] = useState(true);
  const [editorMode, setEditorMode] = useState('add');
  const [riddleType, setRiddleType] = useState(1);
  const [riddleKeywords, setRiddleKeywords] = useState('');
  const [riddleImages, setRiddleImages] = useState('');
  const [riddleImagesUrl, setRiddleImagesUrl] = useState('');

  const [isShowCropperDialog, setIsShowCropperDialog] = useState(false);
  const [imgForCropper, setImgForCropper] = useState('');
  const [cropper, setCropper] = useState();
  const [cropperConfirm, setCropperConfirm] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRiddleList());
  }, []);
  const showEditDialog = () => {
    setEditorMode('add');
    setRiddleType(1);
    setRiddleKeywords('');
    setIsShowEditDialog(true);
  };
  const props = {
    multiple: false,
    uploading: false,
    showUploadList: false,
    disabled: riddleType !== 1,
    beforeUpload: (file) => {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpeg') {
        message.error('不支持的图片格式');
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {  // 读取完成 后将图片的base64地址信息赋值给imgObj.src
        // e.target.result就是图片的base64地址信息
        setImgForCropper(e.target.result);
      };
      setIsShowCropperDialog(true);
      return false;
    },
  };

  const ProcImages = () => {
    // 处理裁剪到的图片
    return new Promise((resolve, reject) =>  {
      const imgCropped = new window.Image();
      imgCropped.src = cropper.getCroppedCanvas().toDataURL('type/png', 1);
      imgCropped.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 960;
        canvas.height = 540;
        context.drawImage(imgCropped, 0, 0, 960, 540);
        resolve(canvas.toDataURL('image/png', 1));
      };
    });
  };

  const renderCropper = () => {
    if (riddleImagesUrl || riddleImages) {
      return <div className="cropped-images-viewer">
        <div className="img-layout">
          <Image
            width={320}
            height={180}
            src={riddleImagesUrl || riddleImages}
          />
        </div>
        <div className="delete-layout" onClick={() => setRiddleImages('')}>
          <DeleteOutlined /> 删除
        </div>
      </div>;
    }
    return <Upload.Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或者拖动图片到这儿上传哦</p>
      <p className="ant-upload-hint">{riddleType === 1 ? '支持png/jpg格式图片' : '画笔模式不支持上传图片哦'}</p>
    </Upload.Dragger>;
  };

  return <div className="app-draw-and-guess-settings">
    <PageHeader
      title="题目设置"
      extra={[
        <Button key="add" type="primary" onClick={showEditDialog}>添加新题目</Button>
      ]}
    />;
    <Modal
      title={editorMode === 'add' ? '新增题目' : '编辑题目'}
      width={896}
      maskClosable={false}
      visible={isShowEditDialog}
      onCancel={() => setIsShowEditDialog(false)}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            autoComplete="off"
          >
            <Form.Item label="题目类型">
              <Select value={riddleType} onChange={(item) => setRiddleType(item)}>
                <Select.Option value={0}>画笔模式</Select.Option>
                <Select.Option value={1}>擦除模式</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="关键字">
              <Input
                value={riddleKeywords}
                placeholder="多个请使用逗号分隔"
                onChange={(e) => setRiddleKeywords(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          {renderCropper()}
        </Col>
      </Row>
    </Modal>
    <Modal
      title="编辑图片"
      width={960}
      maskClosable={false}
      visible={isShowCropperDialog}
      confirmLoading={cropperConfirm}
      onCancel={() => setIsShowCropperDialog(false)}
      onOk={async () => {
        setCropperConfirm(true);
        setRiddleImages(await ProcImages());
        setCropperConfirm(false);
        setIsShowCropperDialog(false);
      }}
    >
      <ReactCropper
        style={{ height: 600, width: '100%' }}
        zoomTo={0.8}
        aspectRatio={16 / 9}
        preview=".img-preview"
        src={imgForCropper}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive
        autoCropArea={1}
        checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
        guides
      />
    </Modal>
  </div>;
};

import React, { useEffect, useState } from 'react';
import {
  PageHeader, Button, Modal, Form, Input, Select, Row, Col, Upload
} from 'antd';
import { useDispatch } from 'react-redux';
import { InboxOutlined } from '@ant-design/icons';
import { getRiddleList } from '@/scripts/store/sagas';

export const SettingView = () => {
  const [isShowEditDialog, setIsShowEditDialog] = useState(false);
  const [editorMode, setEditorMode] = useState('add');
  const [riddleType, setRiddleType] = useState(0);
  const [riddleKeywords, setRiddleKeywords] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRiddleList());
  }, []);
  const showEditDialog = () => {
    setEditorMode('add');
    setIsShowEditDialog(true);
  };
  const props = {
    multiple: false,
    uploading: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      // if (status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
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
      visible={isShowEditDialog}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
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
        <Col span={16}>
          <Upload.Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Upload.Dragger>
        </Col>
      </Row>
    </Modal>
  </div>;
};

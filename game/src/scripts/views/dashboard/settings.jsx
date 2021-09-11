import 'cropperjs/dist/cropper.css';
import React, { useEffect, useState } from 'react';
import {
  PageHeader, Button, Modal, Form, Input, Card,
  Select, Row, Col, Upload, message, Image, Alert
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  InboxOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  addRiddle, deleteRiddle, editRiddle, getRiddleList
} from '@/scripts/store/sagas';
import ReactCropper from 'react-cropper';

export const SettingView = () => {
  const riddleList = useSelector((state) => state.riddles.list);

  const [isShowEditDialog, setIsShowEditDialog] = useState(false);
  const [editorMode, setEditorMode] = useState('add');
  const [riddleType, setRiddleType] = useState(1);
  const [riddleKeywords, setRiddleKeywords] = useState('');
  const [riddleImages, setRiddleImages] = useState('');
  const [riddleImagesUrl, setRiddleImagesUrl] = useState('');
  const [riddleConfirm, setRiddleConfirm] = useState(false);
  const [riddleId, setRiddleId] = useState(0);

  const [isShowCropperDialog, setIsShowCropperDialog] = useState(false);
  const [imgForCropper, setImgForCropper] = useState('');
  const [cropper, setCropper] = useState();
  const [cropperConfirm, setCropperConfirm] = useState(false);

  const dispatch = useDispatch();

  const fetchRiddleList = () => {
    dispatch(getRiddleList());
  };

  const addRiddleDialog = () => {
    setEditorMode('add');
    setRiddleType(1);
    setRiddleKeywords('');
    setRiddleImages('');
    setRiddleImagesUrl('');
    setIsShowEditDialog(true);
  };

  const editRiddleDialog = (item) => {
    setEditorMode('edit');
    setRiddleType(item.type);
    setRiddleKeywords(item.keywords.join(','));
    setRiddleImages('');
    setRiddleImagesUrl(item.image);
    setRiddleId(item.id);
    setIsShowEditDialog(true);
  };

  const uploaderProps = {
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

  const submitRiddle = () => {
    if (!riddleKeywords) {
      message.error('请设置题目的关键词');
      return;
    }
    if (riddleType === 1 && (!riddleImages && !riddleImagesUrl)) {
      message.error('擦除模式请上传底图');
      return;
    }
    const postData = {
      type: riddleType,
      keywords: riddleKeywords,
    };
    if (riddleType === 1) {
      postData.images = riddleImages.replace(/data:image\/(\w+);base64,/, '');
    }
    setRiddleConfirm(true);
    if (editorMode === 'add') {
      dispatch(addRiddle({
        data: postData,
        onSuccess: () => {
          message.success('添加成功！');
          setIsShowEditDialog(false);
          fetchRiddleList();
        },
        onError: (e) => {
          message.error(e.message);
        },
        onCompleted: () => {
          setRiddleConfirm(false);
        },
      }));
    } else {
      postData.id = riddleId;
      dispatch(editRiddle({
        data: postData,
        onSuccess: () => {
          message.success('编辑成功！');
          setIsShowEditDialog(false);
          fetchRiddleList();
        },
        onError: (e) => {
          message.error(e.message);
        },
        onCompleted: () => {
          setRiddleConfirm(false);
        },
      }));
    }
  };

  const handleDeleteRiddle = (id) => {
    Modal.confirm({
      title: '确定要删除这个题目吗?',
      icon: <ExclamationCircleOutlined />,
      content: '已裁剪的图片不会被删除',
      okText: '删除',
      okType: 'danger',
      onOk() {
        dispatch(deleteRiddle({
          data: { id },
          onSuccess: () => {
            message.success('删除成功！');
            setIsShowEditDialog(false);
            fetchRiddleList();
          },
          onError: (e) => {
            message.error(e.message);
          },
          onCompleted: () => {
            setRiddleConfirm(false);
          },
        }));
      },
    });
  };

  const ProcImages = () => {
    // 处理裁剪到的图片
    return new Promise((resolve) =>  {
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

  useEffect(() => {
    fetchRiddleList();
  }, []);

  const renderCropper = () => {
    if (riddleImagesUrl || riddleImages) {
      return <div className="cropped-images-viewer">
        <div className="img-layout">
          <Image
            width={320}
            height={180}
            src={riddleImagesUrl ? `//${process.env.API_HOST}/${riddleImagesUrl}` : riddleImages}
          />
        </div>
        <div
          className="delete-layout"
          onClick={() => {
            setRiddleImages('');
            setRiddleImagesUrl('');
          }}
        >
          <DeleteOutlined /> 删除
        </div>
      </div>;
    }
    return <Upload.Dragger {...uploaderProps}>
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
        <Button key="add" type="primary" onClick={addRiddleDialog}>添加新题目</Button>
      ]}
    />
    <div className="riddle-list-layout">
      {riddleList.map((item) => <Card
        key={item.id}
        style={{ width: 300 }}
        cover={<img
          alt="example"
          src={`//${process.env.API_HOST}/${item.image}?m=${item.update_time}`}
        />}
        actions={[
          <EditOutlined key="edit" onClick={() => editRiddleDialog(item)} />,
          <DeleteOutlined key="delete" onClick={() => handleDeleteRiddle(item.id)} />
        ]}
      >
        <Card.Meta
          title={item.keywords.join(',')}
          description={item.type === 1 ? '擦除模式' : '画笔模式'}
        />
      </Card>)}
    </div>
    
    <Modal
      title={editorMode === 'add' ? '新增题目' : '编辑题目'}
      width={896}
      maskClosable={false}
      visible={isShowEditDialog}
      onCancel={() => setIsShowEditDialog(false)}
      onOk={submitRiddle}
      confirmLoading={riddleConfirm}
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
                <Select.Option value={0} disabled>画笔模式</Select.Option>
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
      <Alert
        message="小提示：双击灰色区域，可以切换为拖动后面的图，再次双击可以切回来；鼠标滚轮可以放大缩小图片。"
        type="info"
        showIcon
        banner
      />
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

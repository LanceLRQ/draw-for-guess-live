import React from 'react';
import { ClearModeDrawPanel } from './clear_mode_draw_panel';
import CatImg from '@/images/cat.jpg';
import {
  Button, Col, Input, Row
} from 'antd';

export const SketchView = () => {
  return <div className="app-draw-and-guess-game">
    <div className="sketch-layout">
      <ClearModeDrawPanel width={960} height={540} targetImage={CatImg} />
    </div>
    <div className="chat-layout">
      <div className="chat-list">

      </div>
      <div className="input-area">
        <Row gutter={8}>
          <Col flex={1}>
            <Input />
          </Col>
          <Col flex={0}>
            <Button type="primary">发送</Button>
          </Col>
        </Row>
      </div>
    </div>
  </div>;
};

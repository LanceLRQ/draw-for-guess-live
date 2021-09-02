import '@/styles/draw/sketching-board.scss';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Row, Col, Slider, Space
} from 'antd';
import { UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { ClearModeDrawLogic } from '../logic/clear_mode_draw';

let drawBoard = null;

export const ClearModeDrawPanel= (props) => {
  const { width, height, targetImage } = props;
  const canvasRef = useRef();
  const pencilRef = useRef();
  const [pencilWidth, setPencilWidth] = useState(31);
  const [cursorType, setCursorType] = useState('eraser');
  const [targetImg, setTargetImg] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      // gameClient = new GameClient();
      // gameClient.Connect('ws://localhost:8975/api/game').then(res => {
      //
      // });
      // window.game = gameClient;

      drawBoard = new ClearModeDrawLogic(canvasRef.current, pencilRef.current);
      drawBoard.onChange = (msg) => {
        console.log(JSON.stringify(msg));
      };
      drawBoard.readonly = false;
      drawBoard.init();
      // drawBoard.reset();
      window.drawBoard = drawBoard;
      drawBoard.setPencilStyle(pencilWidth);

      const img = new Image();
      img.src = targetImage;
      img.onload = () => {
        setTargetImg(targetImage);
      };
    }
    return () => {
      if (drawBoard) {
        drawBoard.destory();
        drawBoard = null;
      }
    };
  }, []);

  useEffect(() => {
    if (drawBoard) {
      drawBoard.setPencilStyle(pencilWidth);
    }
  }, [pencilWidth]);

  useEffect(() => {
    drawBoard.setCursorType(cursorType);
  }, [cursorType]);

  const cursorSize = pencilWidth;
  const wrapperStyle = {
    width,
    height,
    backgroundImage: `url(${targetImg})`,
    display: targetImg ? 'block' : 'none',
  };
  return <div className="sketching-board">
    <div className="draw-wrapper" style={wrapperStyle}>
      <canvas className="cover-layer" ref={canvasRef} width={width} height={height} style={{ width, height }} />
      <span id="app-draw-pencil" ref={pencilRef} style={{ position: 'absolute', display: 'none', pointerEvents: 'none' }}>
        <div
          style={{
            borderRadius: '50%',
            border: '2px solid #fff',
            width: cursorSize,
            height: cursorSize,
          }}
        />
      </span>
    </div>
    <Row className="control-bar">
      <Col span={4}>
        <Slider
          value={pencilWidth}
          min={11}
          max={51}
          step={5}
          onChange={(v) => { setPencilWidth(v * 1); }}
        />
      </Col>
      <Col span={16} />
      <Col span={4} style={{ textAlign: 'right' }}>
        <Space>
          <Button type="default" shape="circle" icon={<UndoOutlined />} onClick={() => drawBoard.undo()} />
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => drawBoard.reset()} />
        </Space>
      </Col>
    </Row>
  </div>;
};

ClearModeDrawPanel.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  targetImage: PropTypes.string.isRequired,
};

ClearModeDrawPanel.defaultProps = {
  width: 960,
  height: 540,
};

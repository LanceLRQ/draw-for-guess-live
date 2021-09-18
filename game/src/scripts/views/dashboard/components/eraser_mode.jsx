import '@/styles/draw/sketching-board.scss';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { noop, debounce } from 'lodash';
import {
  Button, Row, Col, Slider, Space, Modal
} from 'antd';
import { UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { EraserModeDrawLogic } from '../../logic/clear_mode_draw';

let drawBoard = null;

const savePencilPerfIntoLocalStorage = debounce((size) => {
  try {
    window.localStorage.setItem('drawing_eraser_mode_pencil_size_pref', size);
  } catch (e) { console.error('save to local storage error'); }
}, 200);

const readPencilPerfIntoLocalStorage = () => {
  try {
    return window.localStorage.getItem('drawing_eraser_mode_pencil_size_pref') * 1;
  } catch (e) {
    return 0;
  }
};

export const EraserModeDrawPanel = (props) => {
  const {
    width, height, targetImage, onInit, onDestroy, onChange,
    readonly, onUndo, onReset,
  } = props;
  const canvasRef = useRef();
  const pencilRef = useRef();
  const [pencilWidth, setPencilWidth] = useState(readPencilPerfIntoLocalStorage() || 35);
  // const [cursorType, setCursorType] = useState('eraser');
  const [targetImg, setTargetImg] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      drawBoard = new EraserModeDrawLogic(canvasRef.current, pencilRef.current);
      drawBoard.onChange = (msg) => {
        onChange(JSON.stringify(msg));
      };
      drawBoard.readonly = readonly;
      drawBoard.init();
      // drawBoard.reset();
      // window.drawBoard = drawBoard;
      drawBoard.setPencilStyle(pencilWidth);

      const img = new Image();
      img.src = targetImage;
      img.onload = () => {
        setTargetImg(targetImage);
      };

      onInit(drawBoard);  // 向父级组件暴露组件
    }
    return () => {
      if (drawBoard) {
        drawBoard.destroy();
        drawBoard = null;
        onDestroy();
      }
    };
  }, [targetImage, readonly]);

  useEffect(() => {
    if (drawBoard) {
      drawBoard.setPencilStyle(pencilWidth);
      savePencilPerfIntoLocalStorage(pencilWidth);
    }
  }, [pencilWidth]);

  // useEffect(() => {
  //   drawBoard.setCursorType(cursorType);
  // }, [cursorType]);

  const cursorSize = pencilWidth;
  const wrapperStyle = {
    width,
    height,
    backgroundImage: `url(${targetImg})`,
    display: targetImg ? 'block' : 'none',
  };
  const resetBoard = () => {
    Modal.confirm({
      title: '将会清空整个画布，确定继续吗？',
      okType: 'danger',
      onOk: () => {
        drawBoard.reset();
        onReset();
      },
    });
  };

  useHotkeys('[', () => {
    let pw = pencilWidth - 2;
    if (pw < 11) pw = 11;
    setPencilWidth(pw);
  }, {}, [pencilWidth]);

  useHotkeys(']', () => {
    let pw = pencilWidth + 2;
    if (pw > 101) pw = 101;
    setPencilWidth(pw);
  }, {}, [pencilWidth]);

  useHotkeys('ctrl+z, cmd+z', () => {
    drawBoard.undo();
    onUndo();
  });

  useHotkeys('del', resetBoard);

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
    {!readonly && <Row className="control-bar">
      <Col span={4}>
        <Slider
          value={pencilWidth}
          min={11}
          max={101}
          step={1}
          onChange={(v) => { setPencilWidth(v * 1); }}
        />
      </Col>
      <Col span={16} />
      <Col span={4} style={{ textAlign: 'right' }}>
        <Space>
          <Button
            type="default"
            shape="circle"
            icon={<UndoOutlined />}
            onClick={() => {
              drawBoard.undo();
              onUndo();
            }}
          />
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={resetBoard}
          />
        </Space>
      </Col>
    </Row>}
  </div>;
};

EraserModeDrawPanel.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  readonly: PropTypes.bool,
  targetImage: PropTypes.string.isRequired,
  onInit: PropTypes.func,
  onDestroy: PropTypes.func,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  onUndo: PropTypes.func,
};

EraserModeDrawPanel.defaultProps = {
  width: 960,
  height: 540,
  readonly: false,
  onInit: noop,
  onDestroy: noop,
  onChange: noop,
  onUndo: noop,
  onReset: noop,
};

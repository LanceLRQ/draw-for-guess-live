import React, { useEffect, useRef } from 'react';
import { List, Tooltip } from 'antd';
import T from 'prop-types';
import {
  List as VList,
  AutoSizer,
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer
} from 'react-virtualized';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { AnswerList } from '@/scripts/views/dashboard/components/answer_list';

const cellMeasureCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: 50,
});

export const DanmakuList = (props) => {
  const { mode } = props;
  const containerRef = useRef();
  const danmakuList = useSelector((state) => {
    return mode === 'round' ? state.danmaku.current : state.danmaku.history;
  });
  useEffect(() => {
    if (containerRef.current && mode === 'global') {
      const list = document.getElementsByClassName('ant-list')[0];
      containerRef.current.scrollTop = list.clientHeight + 10000;
    }
  });
  const renderItem = ({
    index,
    key,
    style,
    parent,
  }) => {
    const item = danmakuList[index];
    return <CellMeasurer
      cache={cellMeasureCache}
      columnIndex={0}
      key={key}
      rowIndex={index}
      parent={parent}
    >
      <List.Item key={key} style={style}>
        <Tooltip title={dayjs(item.receive_time * 1000).format('YYYY-MM-DD HH:mm:ss')}>
          <div>
            <strong style={{ color: 'gray' }}>{item?.uname}：</strong>
            {item.text}
          </div>
        </Tooltip>
      </List.Item>
    </CellMeasurer>;
  };

  const vList = ({ height, scrollTop, width }) => (
    <VList
      autoHeight
      height={height}
      overscanRowCount={2}
      rowCount={danmakuList.length}
      rowHeight={cellMeasureCache.rowHeight}
      deferredMeasurementCache={cellMeasureCache}
      rowRenderer={renderItem}
      scrollTop={scrollTop}
      width={width}
    />
  );
  return <div className="danmaku-layout">
    <div className="danmaku-list" ref={containerRef}>
      <List
        size="small"
      >
        <WindowScroller scrollElement={containerRef.current}>
          {({ height, scrollTop }) => {
            return (
              <AutoSizer disableHeight>
                {({ width }) => vList({
                  height,
                  scrollTop,
                  width,
                })}
              </AutoSizer>
            );
          }}
        </WindowScroller>
      </List>
    </div>
    {mode === 'round' && <AnswerList />}
  </div>;
};

DanmakuList.propTypes = {
  mode: T.string,
};

DanmakuList.defaultProps = {
  mode: 'global',
};

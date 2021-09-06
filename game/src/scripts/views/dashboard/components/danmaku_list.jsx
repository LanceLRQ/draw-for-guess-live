import React, { useEffect, useRef } from 'react';
import { List } from 'antd';
// import T from 'prop-types';
import {
  List as VList,
  AutoSizer,
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer
} from 'react-virtualized';
import { useSelector } from 'react-redux';

const cellMeasureCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: 50,
});

export const DanmakuList = () => {
  const containerRef = useRef();
  const danmakuList = useSelector((state) => {
    return state.danmaku.history;
  });
  useEffect(() => {
    if (containerRef.current) {
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
        <div>
          <strong style={{ color: 'gray' }}>{item?.uname}：</strong>
          {item.text}
        </div>
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
  return <div className="danmaku-list" ref={containerRef}>
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
  </div>;
};

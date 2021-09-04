import { noop } from 'lodash';
import NeffosJS from 'neffos.js';
import store from '../../store';
import { pushDanmaku } from '../../store/sagas';

export class GameClient {
  server = null;

  client = null;

  handleDrawAction = noop;

  handleClearAction = noop;

  handleUndoAction = noop;

  async Connect(url) {
    try {
      this.server = await NeffosJS.dial(url, {
        drawing: {
          _OnNamespaceConnected: (nsConn) => {
            if (nsConn.conn.wasReconnected()) {
              console.log(`[WS] 经过${nsConn.conn.reconnectTries.toString()}次尝试后重新连接到服务器`);
            } else {
              console.log('[WS] 成功连接到服务器');
            }
          },
          _OnNamespaceDisconnect: () => {
            console.log('[WS] 服务器连接已断开');
          },
          draw: (nsConn, msg) => {
            this.handleDrawAction(msg.Body, msg);
          },
          clear: (nsConn, msg) => {
            this.handleClearAction(msg.Body, msg);
          },
          undo: (nsConn, msg) => {
            this.handleUndoAction(msg.Body, msg);
          },
          danmaku: (nsConn, msgRaw) => {
            const msg = JSON.parse(msgRaw.Body);
            store.dispatch(pushDanmaku(msg));
          },
        },
      }, { // optional.
        reconnect: 1000,
        // set custom headers.
        headers: {
          // 'X-Username': 'kataras',
        },
      });
      this.client = await this.server.connect('drawing');
      // this.client.send
    } catch (e) {
      console.error(`[WS] 连接游戏服务器出现错误：${e}`);
    }
  }

  Close = () => {
    this.client.disconnect();
    this.client = null;
    this.server.close();
    this.server = null;
  }
}

export default GameClient;

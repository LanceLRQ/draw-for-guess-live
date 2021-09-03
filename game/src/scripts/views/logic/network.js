import { noop } from 'lodash';
import NeffosJS from 'neffos.js';

export class GameClient {
  server = null;

  client = null;

  handleDrawAction = noop;

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
          draw: (nsConn, msg) => { // "draw" event.
            // console.log(msg.Body);
            this.handleDrawAction(msg.Body, msg);
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
}

export default GameClient;

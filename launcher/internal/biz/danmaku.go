package biz

import (
	"fmt"
	"github.com/kataras/neffos"
	"launcher/internal/data"
	"launcher/internal/server"
	"launcher/internal/utils"
	"launcher/internal/utils/gobilibili"
	"launcher/internal/views/dashboard"
	"log"
)


var BilibiliClient *gobilibili.BiliBiliClient

func InitDanmakuService() {
	for {
		BilibiliClient = gobilibili.NewBiliBiliClient()
		BilibiliClient.RegHandleFunc(gobilibili.CmdDanmuMsg, func(c *gobilibili.Context) bool {
			info := c.GetDanmuInfo()
			log.Printf("[%d]%d 说: %s\r\n", c.RoomID, info.UID, info.Text)
			data.GameStatus.CurrentDanmaku = append([]gobilibili.DanmuInfo{info}, data.GameStatus.CurrentDanmaku...)
			data.GameStatus.GlobalDanmaku = append(data.GameStatus.GlobalDanmaku, info)
			if dashboard.DrawingWebSocketServer != nil {
				dashboard.DrawingWebSocketServer.Broadcast(nil, neffos.Message{
					Namespace: "drawing",
					Event:     "danmaku",
					Body:      []byte(utils.ObjectToJSONString(info, false)),
				})
			}
			return false
		})
		// 传入房间号
		err := BilibiliClient.ConnectServer(server.Config.Bilibili.RoomId)
		if err != nil {
			fmt.Printf("[danmaku] Error: %s\n", err.Error())
		}
	}
}

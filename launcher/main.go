package main

import (
	gobilibili "github.com/sirodeneko/gobilibiliDanmu"
	"log"
	"time"
)

func main() {
	for {
		bili := gobilibili.NewBiliBiliClient()
		bili.RegHandleFunc(gobilibili.CmdDanmuMsg, func(c *gobilibili.Context) bool {
			dinfo := c.GetDanmuInfo()
			log.Printf("%s[%d] 说: %s\r\n", dinfo.Uname, dinfo.UID, dinfo.Text)
			return false
		})
		// 传入房间号
		err := bili.ConnectServer(1319)
		log.Println(err)
		time.Sleep(3000)
	}
}

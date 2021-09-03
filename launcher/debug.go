package main

import "launcher/internal/biz"

func main()  {
	//err := internal.RunServer("./config.yml", "")
	//if err != nil {
	//	log.Fatal(err)
	//}
	biz.InitDanmakuService()
}


//func main() {
//	for {
//		bili := gobilibili.NewBiliBiliClient()
//		bili.RegHandleFunc(gobilibili.CmdDanmuMsg, func(c *gobilibili.Context) bool {
//			dinfo := c.GetDanmuInfo()
//			log.Printf("%s[%d] 说: %s\r\n", dinfo.Uname, dinfo.UID, dinfo.Text)
//			return false
//		})
//		// 传入房间号
//		err := bili.ConnectServer(1319)
//		log.Println(err)
//		time.Sleep(3000)
//	}
//}

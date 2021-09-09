package internal

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/logger"
	"github.com/kataras/iris/v12/middleware/recover"
	"launcher/internal/biz"
	"launcher/internal/server"
	"launcher/internal/views"
)

func runHttpServer() error {
	app := iris.New()

	if server.Config.DebugMode {
		app.Logger().SetLevel("debug")
	} else {
		app.Logger().SetLevel("info")
	}
	// Optionally, add two builtin handlers
	// that can recover from any http-relative panics
	// and log the requests to the terminal.
	app.Use(recover.New())
	app.Use(logger.New())

	views.RegisterRouter(app)

	err := app.Run(iris.Addr(fmt.Sprintf("%s:%d", server.Config.Server.Listen, server.Config.Server.Port)))
	if err != nil { return err }

	return err
}

func RunServer (configFile string, address string) error {
	// Load
	err := server.LoadConfiguration(configFile)
	if err != nil { return err }
	// 载入谜题列表
	biz.LoadRiddleList()
	// 启动弹幕姬
	go biz.InitDanmakuService()
	// Run server
	err = runHttpServer()
	if err != nil { return err }
	return nil
}
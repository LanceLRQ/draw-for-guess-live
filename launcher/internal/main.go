package internal

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/logger"
	"github.com/kataras/iris/v12/middleware/recover"
	"draw-for-guess-live/internal/server"
	"draw-for-guess-live/internal/views"
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
	//app.Use(server.NewGuess640Jwt())

	views.RegisterRouter(app)

	err := app.Run(iris.Addr(fmt.Sprintf("%s:%d", server.Config.Server.Listen, server.Config.Server.Port)))
	if err != nil { return err }

	return err
}

func parseListenAddress(address string) {

}

func RunServer (configFile string, address string) error {
	// Load
	err := server.LoadConfiguration(configFile)
	if err != nil { return err }
	parseListenAddress(address)
	// Run server
	err = runHttpServer()
	if err != nil { return err }
	return nil
}
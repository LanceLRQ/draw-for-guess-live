package views

import (
	"github.com/kataras/iris/v12"
	"launcher/internal/views/dashboard"
)

func RegisterRouter(app *iris.Application) {
	app.Get("/", func (ctx iris.Context) {
		_, _ = ctx.HTML("Hello world")
	})
	app.Get("/store/{file_name}", StoreStatic)
	dashboard.RegisterRoom(app.Party("/api/dashboard"))
}

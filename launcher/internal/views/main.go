package views

import (
	"github.com/kataras/iris/v12"
)

func RegisterRouter(app *iris.Application) {
	app.Get("/", func (ctx iris.Context) {
		_, _ = ctx.HTML("Hello world")
	})
}

package views

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"io/ioutil"
)

func StoreStatic(ctx iris.Context) {
	fileName := ctx.Params().GetString("file_name")
	if len(fileName) > 4 && fileName[len(fileName)-4:] == ".png" {
		imgFile, err := ioutil.ReadFile(fmt.Sprintf("./store/%s", fileName))
		if err != nil {
			ctx.StatusCode(404)
			ctx.Text("Not Found")
			return
		}
		ctx.Write(imgFile)
		ctx.Header("Content-Type", "image/png")
	}
	ctx.StatusCode(404)
	ctx.Text("Not Found")
}

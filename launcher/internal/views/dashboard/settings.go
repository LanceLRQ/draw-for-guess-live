package dashboard

import (
	"github.com/kataras/iris/v12"
	"launcher/internal/data"
)

// 获取谜语列表
func GetGameStatus(ctx iris.Context) {
	ctx.JSON(&data.RESTResult{
		Status: true,
		ErrCode: 0,
		Message: "",
		Data: data.GameStatus,
	})
}
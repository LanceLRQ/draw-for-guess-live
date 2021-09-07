package server

import (
	"github.com/kataras/iris/v12"
	"launcher/internal/data"
	"launcher/internal/errors"
)

func SendRESTSuccessResult(ctx iris.Context, content interface{}) {
	ctx.StatusCode(200)
	ctx.JSON(&data.RESTResult{
		Status: true,
		ErrCode: 0,
		Message: "",
		Data: content,
	})
}
func SendRESTSuccessResultWithMessage(ctx iris.Context, content interface{}, message string) {
	ctx.StatusCode(200)
	ctx.JSON(&data.RESTResult{
		Status: true,
		ErrCode: 0,
		Message: message,
		Data: content,
	})
}

func SendESTErrorResult (ctx iris.Context, err error) {
	ctx.StatusCode(500)
	// 类型断言：如果是CustomError，会试图读取具体错误信息
	if pe, ok := err.(errors.CustomError); ok {
		ctx.JSON(&data.RESTResult{
			Status: false,
			ErrCode: pe.Code,
			Message: pe.Message,
		})
	} else if err != nil {
		ctx.JSON(&data.RESTResult{
			Status: false,
			ErrCode: -1,
			Message: err.Error(),
		})
	}
}

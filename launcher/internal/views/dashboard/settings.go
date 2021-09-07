package dashboard

import (
	"encoding/base64"
	"fmt"
	"github.com/kataras/iris/v12"
	"io/ioutil"
	"launcher/internal/biz"
	"launcher/internal/data"
	"launcher/internal/errors"
	"launcher/internal/server"
	"path/filepath"
	"strings"
)

// 获取谜语列表
func GetGameStatus(ctx iris.Context) {
	server.SendRESTSuccessResult(ctx, server.GameStatus)
}

func GetRiddleList (ctx iris.Context) {
	server.SendRESTSuccessResult(ctx, server.RiddleListConfig)
}

func AddRiddleList (ctx iris.Context) {
	keywordsText := ctx.PostValueDefault("keywords", "")
	typeId := ctx.PostValueIntDefault("type", 1)
	images := ctx.PostValueDefault("", "")

	if keywordsText == "" {
		server.SendESTErrorResult(ctx, errors.EmptyKeywordsError)
		return
	}
	if typeId < 0 || typeId > 1 {
		server.SendESTErrorResult(ctx, errors.UnknownTypeError)
		return
	}
	if typeId == 1 && images == "" {
		server.SendESTErrorResult(ctx, errors.EmptyImageError)
		return
	}

	newItem := data.RiddleInfo{
		Id: server.RiddleListConfig.AtomicId + 1,
		Type: typeId,
		Keywords: strings.Split(keywordsText, ","),
	}

	// 写入图片
	if typeId == 1 {
		imgPath := filepath.Join(server.Config.Server.Store, fmt.Sprintf("riddle_%d.png", newItem.Id))
		newItem.Image = imgPath
		imgBytes, err := base64.StdEncoding.DecodeString(images)
		if err != nil {
			server.SendESTErrorResult(ctx, errors.DecodeImageError(err.Error()))
			return
		}

		err = ioutil.WriteFile(imgPath, imgBytes, 077)
		if err != nil {
			server.SendESTErrorResult(ctx, errors.SaveImageError(err.Error()))
			return
		}
	}

	server.RiddleListConfig.RiddleList = append(server.RiddleListConfig.RiddleList, newItem)
	server.RiddleListConfig.AtomicId++
	err := biz.SaveRiddleList()
	if err != nil {
		server.SendESTErrorResult(ctx, err)
	}
	server.SendRESTSuccessResult(ctx, nil)
}

func EditRiddleList (ctx iris.Context) {
	id, err := ctx.PostValueInt("id")
	if err != nil {
		server.SendESTErrorResult(ctx, errors.NoneIdError)
		return
	}
	recordIndex := -1
	for i := 0; i < len(server.RiddleListConfig.RiddleList); i++ {
		if id == server.RiddleListConfig.RiddleList[i].Id {
			recordIndex = i
		}
	}
	if recordIndex < 0 {
		server.SendESTErrorResult(ctx, errors.RiddleInfoNotFoundError)
		return
	}

	keywordsText := ctx.PostValueDefault("keywords", "")
	typeId := ctx.PostValueIntDefault("type", 1)
	images := ctx.PostValueDefault("", "")

	if keywordsText == "" {
		server.SendESTErrorResult(ctx, errors.EmptyKeywordsError)
		return
	}
	if typeId < 0 || typeId > 1 {
		server.SendESTErrorResult(ctx, errors.UnknownTypeError)
		return
	}

	// 如果需要改动图片，写入图片
	if typeId == 1 && images != "" {
		imgBytes, err := base64.StdEncoding.DecodeString(images)
		if err != nil {
			server.SendESTErrorResult(ctx, errors.DecodeImageError(err.Error()))
			return
		}

		err = ioutil.WriteFile(
			filepath.Join(),
			imgBytes,
			077,
		)
		if err != nil {
			server.SendESTErrorResult(ctx, errors.SaveImageError(err.Error()))
			return
		}
	}

	server.RiddleListConfig.RiddleList[recordIndex].Type = typeId
	server.RiddleListConfig.RiddleList[recordIndex].Keywords = strings.Split(keywordsText, ",")
	err = biz.SaveRiddleList()
	if err != nil {
		server.SendESTErrorResult(ctx, err)
	}
	server.SendRESTSuccessResult(ctx, nil)
}
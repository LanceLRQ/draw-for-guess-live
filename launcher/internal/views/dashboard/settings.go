package dashboard

import (
	"encoding/base64"
	"fmt"
	"github.com/kataras/iris/v12"
	"github.com/kataras/neffos"
	"io/ioutil"
	"launcher/internal/biz"
	"launcher/internal/data"
	"launcher/internal/errors"
	"launcher/internal/server"
	"launcher/internal/utils"
	"launcher/internal/utils/gobilibili"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func findRiddle(ctx iris.Context) int {
	id, err := ctx.PostValueInt("id")
	if err != nil {
		server.SendESTErrorResult(ctx, errors.NoneIdError)
		return -1
	}
	recordIndex := -1
	for i := 0; i < len(server.RiddleListConfig.RiddleList); i++ {
		if id == server.RiddleListConfig.RiddleList[i].Id {
			recordIndex = i
		}
	}
	if recordIndex < 0 {
		server.SendESTErrorResult(ctx, errors.RiddleInfoNotFoundError)
		return -1
	}
	return recordIndex
}

// GetGameStatus 获取谜语列表
func GetGameStatus(ctx iris.Context) {
	server.SendRESTSuccessResult(ctx, server.GameStatus)
}

func GetRiddleList (ctx iris.Context) {
	server.SendRESTSuccessResult(ctx, server.RiddleListConfig)
}

func AddRiddle (ctx iris.Context) {
	keywordsText := ctx.PostValueDefault("keywords", "")
	typeId := ctx.PostValueIntDefault("type", 1)
	images := ctx.PostValueDefault("images", "")

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
		Keywords: strings.Split(strings.Replace(keywordsText, "，", ",", -1), ","),
		UpdateTime: int(time.Now().Unix()),
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

		err = ioutil.WriteFile(imgPath, imgBytes, os.ModePerm)
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

func EditRiddle (ctx iris.Context) {
	recordIndex := findRiddle(ctx)
	if recordIndex == -1 { return }

	id := server.RiddleListConfig.RiddleList[recordIndex].Id
	keywordsText := ctx.PostValueDefault("keywords", "")
	typeId := ctx.PostValueIntDefault("type", 1)
	images := ctx.PostValueDefault("images", "")

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
			filepath.Join(filepath.Join(server.Config.Server.Store, fmt.Sprintf("riddle_%d.png", id))),
			imgBytes,
			os.ModePerm,
		)
		if err != nil {
			server.SendESTErrorResult(ctx, errors.SaveImageError(err.Error()))
			return
		}
	}

	server.RiddleListConfig.RiddleList[recordIndex].Type = typeId
	server.RiddleListConfig.RiddleList[recordIndex].Keywords = strings.Split(strings.Replace(keywordsText, "，", ",", -1), ",")
	server.RiddleListConfig.RiddleList[recordIndex].UpdateTime = int(time.Now().Unix())
	err := biz.SaveRiddleList()
	if err != nil {
		server.SendESTErrorResult(ctx, err)
	}
	server.SendRESTSuccessResult(ctx, nil)
}

func DeleteRiddle (ctx iris.Context) {
	recordIndex := findRiddle(ctx)
	if recordIndex == -1 { return }

	server.RiddleListConfig.RiddleList = append(
		server.RiddleListConfig.RiddleList[:recordIndex],
		server.RiddleListConfig.RiddleList[recordIndex+1:]...
	)
	err := biz.SaveRiddleList()
	if err != nil {
		server.SendESTErrorResult(ctx, err)
	}
	server.SendRESTSuccessResult(ctx, nil)
}

// GameChangeRiddle 更换题目
func GameChangeRiddle (ctx iris.Context) {
	id, err := ctx.PostValueInt("id")
	if err != nil {
		server.SendESTErrorResult(ctx, errors.NoneIdError)
		return
	}
	if id == 0 {
		server.GameStatus.CurrentRiddle = nil
		server.GameStatus.CurrentId = 0
	} else {
		recordIndex := findRiddle(ctx)
		if recordIndex == -1 {
			return
		}

		server.GameStatus.CurrentRiddle = &server.RiddleListConfig.RiddleList[recordIndex]
		server.GameStatus.CurrentId = server.GameStatus.CurrentRiddle.Id
	}

	server.GameStatus.CurrentDanmaku = []gobilibili.DanmuInfo{}
	server.GameStatus.DrawingHistory = []data.DrawingOperation{}

	sMsg := struct {
		CurrentId     int              `json:"current_id"`
		CurrentRiddle *data.RiddleInfo `json:"current_riddle"`
	}{
		CurrentId:     server.GameStatus.CurrentId,
		CurrentRiddle: server.GameStatus.CurrentRiddle,
	}

	server.DrawingWebSocketServer.Broadcast(nil, neffos.Message{
		Namespace: "drawing",
		Event:     "change",
		Body:      []byte(utils.ObjectToJSONString(sMsg, false)),
	})

	server.SendRESTSuccessResult(ctx, sMsg)
}
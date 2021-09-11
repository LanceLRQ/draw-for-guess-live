package server

import (
	"fmt"
	"github.com/kataras/neffos"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"launcher/internal/data"
	"launcher/internal/utils/gobilibili"
	"os"
	"path/filepath"
)

var Config data.ServerConfiguration

// 全局可用的游戏状态
var GameStatus = data.GameStatus {
	CurrentId:      0, // <= 0 表示游戏没有开始
	CurrentRiddle:  nil,
	CurrentDanmaku: []gobilibili.DanmuInfo{},
	GlobalDanmaku:  []gobilibili.DanmuInfo{},
	DrawingHistory: []data.DrawingOperation{},
}

// 全局谜题列表
var RiddleListConfig = data.RiddleListConfig {
	RiddleList: data.RiddleList{},
	AtomicId: 0,
}

// 全局websocket
var DrawingWebSocketServer *neffos.Server = nil

func LoadConfiguration(path string) error {
	yamlFile, err := ioutil.ReadFile(path)
	if err != nil {
		return fmt.Errorf("failed to load configuration: %s", err.Error())
	}
	err = yaml.Unmarshal(yamlFile, &Config)
	if err != nil {
		return fmt.Errorf("failed to unmarshal configuration: %s", err.Error())
	}
	// parse store
	storePath, err := filepath.Abs(Config.Server.Store)
	if err != nil {
		Config.Server.Store = storePath
	}
	storeDir, err := os.Stat(storePath)
	if err != nil {
		if !os.IsExist(err) {
			err = os.Mkdir(storePath, os.ModePerm)
			return fmt.Errorf("create store dir error: %s", err.Error())
		} else {
			return fmt.Errorf("get store dir error: %s", err.Error())
		}
	} else {
		if !storeDir.IsDir() {
			return fmt.Errorf("store dir must be a directory: %s", err.Error())
		}
	}

	return nil
}

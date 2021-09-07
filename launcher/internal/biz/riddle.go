package biz

import (
	"encoding/json"
	"io/fs"
	"io/ioutil"
	"launcher/internal/server"
	"launcher/internal/utils"
	"path/filepath"
)

func LoadRiddleList() {
	jsonFile, err := ioutil.ReadFile(filepath.Join(server.Config.Server.Store, "./riddle.json"))
	if err != nil {
		return
	}
	_ = json.Unmarshal(jsonFile, &server.RiddleListConfig)
}
func SaveRiddleList() error {
	body := utils.ObjectToJSONByte(&server.RiddleListConfig, false)
	return ioutil.WriteFile(filepath.Join(server.Config.Server.Store, "./riddle.json"), body, fs.ModePerm)
}

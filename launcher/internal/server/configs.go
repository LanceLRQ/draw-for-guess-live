package server

import (
	"fmt"
	"gopkg.in/yaml.v2"
	"launcher/internal/data"
	"io/ioutil"
)

var Config data.ServerConfiguration

func LoadConfiguration(path string) error {
	yamlFile, err := ioutil.ReadFile(path)
	if err != nil {
		return fmt.Errorf("failed to load configuration: %s", err.Error())
	}
	err = yaml.Unmarshal(yamlFile, &Config)
	if err != nil {
		return fmt.Errorf("failed to unmarshal configuration: %s", err.Error())
	}
	return nil
}
package utils

import "time"

// GetNowTimeString 获取当前系统时间并按照中国的格式标准表达
func GetNowTimeString() string {
	return time.Now().Format("2006-01-02 15:04:05.999")
}

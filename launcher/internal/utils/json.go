package utils

import (
	"bytes"
	"encoding/json"
)

// ObjectToJSONString 对象转JSON字符串
func ObjectToJSONString(obj interface{}, format bool) string {
	return string(ObjectToJSONByte(obj, format))
}

// ObjectToJSONByte 对象转JSON字节
func ObjectToJSONByte(obj interface{}, format bool) []byte {
	b, err := json.Marshal(obj)
	if err != nil {
		return []byte("{}")
	} else {
		if format {
			var out bytes.Buffer
			err = json.Indent(&out, b, "", "    ")
			if err != nil {
				return[]byte("{}")
			}
			return out.Bytes()
		}
		return b
	}
}

// JSONStringToObject JSON字符串转对象
func JSONStringToObject(jsonStr string, obj interface{}) bool {
	return JSONStringByteToObject([]byte(jsonStr), obj)
}

// JSONStringByteToObject JSON字节流转对象
func JSONStringByteToObject(jsonStrByte []byte, obj interface{}) bool {
	err := json.Unmarshal(jsonStrByte, &obj)
	if err != nil {
		return false
	} else {
		return true
	}
}

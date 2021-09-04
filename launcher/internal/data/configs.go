package data

type ServerConfiguration struct {
	// 服务器配置  （优先级比-l低）
	Server  struct {
		// 监听IP
		Listen string `yaml:"listen" json:"listen"`
		// 监听端口
		Port int `yaml:"port" json:"port,int"`
	} `yaml:"server" json:"server"`

	// REDIS CLI配置
	Bilibili struct {
		// 数据库IP
		RoomId int `yaml:"room_id" json:"room_id"`
	} `yaml:"bilibili" json:"bilibili"`

	// 调试模式
	DebugMode bool `yaml:"debug" json:"debug"`
}

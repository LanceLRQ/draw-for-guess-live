package data

type ServerConfiguration struct {
	// 服务器配置  （优先级比-l低）
	Server  struct {
		// 监听IP
		Listen string `yaml:"listen" json:"listen"`
		// 监听端口
		Port int `yaml:"port" json:"port,int"`
		// 会话安全salt
		SessionSalt string `yaml:"session_salt" json:"session_salt"`
	} `yaml:"server" json:"server"`

	// REDIS CLI配置
	Redis struct {
		// 数据库IP
		Host string `yaml:"host" json:"host"`
		// 数据库端口
		Port int `yaml:"port" json:"port,int"`
		// 数据库密码
		Password string `yaml:"password" json:"password"`
		// 数据库ID
		SystemDB int `yaml:"db" json:"db"`
	} `yaml:"redis" json:"redis"`

	// 调试模式
	DebugMode bool `yaml:"debug" json:"debug"`
}

package data

import "launcher/internal/utils/gobilibili"

const (
	RiddleTypeDraw   = 0 // 你画我猜
	RiddleTypeEraser = 1 // 你擦我猜
)

// 谜题
type RiddleInfo struct {
	Id       int    `json:"id"`      // 题目编号
	Keywords []string `json:"keywords"` // 关键词，用于命中
	Type     int    `json:"type"`    // 题目类型
	Image    string `json:"image"`   // 图片文件位置
}

type RiddleList []RiddleInfo // 谜题列表（倒序）

type RiddleListConfig struct {
	RiddleList RiddleList `json:"riddle_list"`  // 谜题列表
	AtomicId int `json:"atomic_id"`   // 自增id
}

// 绘图状态
type DrawingOperation struct {
	Type string // 绘图操作事件类型
	Msg  string // 消息的文本
}

// 服务器端用于记录游戏状态，不持久化。
type GameStatus struct {
	CurrentId      int                    `json:"current_id"` // 题目编号
	CurrentRiddle  *RiddleInfo            `json:"current_riddle"`
	CurrentDanmaku []gobilibili.DanmuInfo `json:"current_danmaku"` // 当前收到的弹幕（倒序）
	GlobalDanmaku  []gobilibili.DanmuInfo `json:"-"`               // 收到的所有弹幕（正序）
	DrawingHistory []DrawingOperation     `json:"drawing_history"` // 绘图操作历史记录，连接上WS以后会自动发送这个操作以恢复绘图
}


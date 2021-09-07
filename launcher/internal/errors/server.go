package errors

// 10 - 系统

var (
	SaveConfigError = NewCustomError(1000, "配置信息保存异常")
	JSONParseError = NewCustomError(1001, "JSON数据解析异常")
	EmptyKeywordsError = NewCustomError(1002, "关键词不能为空")
	UnknownTypeError = NewCustomError(1003, "未知的题目类型")
	EmptyImageError = NewCustomError(1004, "你擦我猜题请上传图片")
	DecodeImageError = NewCustomErrorWithAddonMessage(1005, "图片信息解码失败")
	SaveImageError = NewCustomErrorWithAddonMessage(1006, "存储图片失败")
	NoneIdError = NewCustomError(1007, "请提供ID参数")
	RiddleInfoNotFoundError = NewCustomError(1008, "未能找到对应的题目")
)
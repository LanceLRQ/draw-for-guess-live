package errors

// 10 - 系统

var (
	RedisConnectionError = NewGuess460CustomError(1000, "数据库访问异常")
	JSONParseError = NewGuess460CustomError(1001, "JSON数据解析异常")
)
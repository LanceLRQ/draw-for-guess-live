package data

type RESTResult struct {
	Status bool `json:"status"`
	ErrCode int `json:"code"`
	Message string `json:"message"`
	Data interface{} `json:"data"`
}
